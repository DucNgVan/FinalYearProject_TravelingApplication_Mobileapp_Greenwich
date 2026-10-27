const crypto = require('crypto');
const itineraryRepository = require('../repositories/itinerary.repository');
const { calculateHaversineDistance, estimateTransitTime } = require('../utils/geo.util');

class ItineraryService {
  async createItinerary(userId, data) {
    const { title, destinationCity, startDate, endDate, visibility = 'PRIVATE', budget } = data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      const err = new Error('Validation Error: endDate must be greater than or equal to startDate');
      err.code = 'VALIDATION_ERROR';
      err.statusCode = 400;
      throw err;
    }

    const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

    const days = [];
    for (let i = 1; i <= totalDays; i++) {
      const dayDate = new Date(start);
      dayDate.setDate(start.getDate() + (i - 1));
      days.push({
        dayNumber: i,
        date: dayDate.toISOString().split('T')[0],
        items: [],
      });
    }

    const collaborators = [
      {
        userId,
        role: 'OWNER',
        status: 'ACCEPTED',
        joinedAt: new Date(),
      },
    ];

    const newTrip = await itineraryRepository.create({
      title,
      destinationCity,
      startDate,
      endDate,
      totalDays,
      visibility,
      budget: budget || { total: 0, currency: 'VND' },
      collaborators,
      days,
    });

    return newTrip;
  }

  async getUserItineraries(userId) {
    return itineraryRepository.findByUser(userId);
  }

  async getItineraryById(id, userId) {
    const trip = await itineraryRepository.findById(id);
    if (!trip) {
      const err = new Error('Itinerary not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    if (trip.visibility === 'PRIVATE') {
      const isMember = trip.collaborators?.some(
        (c) => c.userId === userId && c.status !== 'DECLINED'
      );
      if (!isMember) {
        const err = new Error('You do not have permission to view this itinerary');
        err.code = 'FORBIDDEN';
        err.statusCode = 403;
        throw err;
      }
    }

    return trip;
  }

  async inviteCollaborator(itineraryId, callerUserId, { userId, role = 'VIEWER' }) {
    const trip = await itineraryRepository.findById(itineraryId);
    if (!trip) {
      const err = new Error('Itinerary not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    // Verify caller role (must be OWNER or EDITOR)
    const callerMember = trip.collaborators?.find((c) => c.userId === callerUserId);
    if (!callerMember || (callerMember.role !== 'OWNER' && callerMember.role !== 'EDITOR')) {
      const err = new Error('Only OWNER or EDITOR can invite collaborators');
      err.code = 'FORBIDDEN';
      err.statusCode = 403;
      throw err;
    }

    const existingIndex = trip.collaborators.findIndex((c) => c.userId === userId);
    if (existingIndex >= 0) {
      trip.collaborators[existingIndex].role = role;
      trip.collaborators[existingIndex].status = 'PENDING';
    } else {
      trip.collaborators.push({
        userId,
        role,
        status: 'PENDING',
        joinedAt: new Date(),
      });
    }

    const updated = await itineraryRepository.update(itineraryId, {
      collaborators: trip.collaborators,
    });

    return updated.collaborators;
  }

  async updateCollaboratorStatus(itineraryId, userId, status) {
    const trip = await itineraryRepository.findById(itineraryId);
    if (!trip) {
      const err = new Error('Itinerary not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const member = trip.collaborators?.find((c) => c.userId === userId);
    if (!member) {
      const err = new Error('User is not a collaborator on this trip');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    member.status = status;

    const updated = await itineraryRepository.update(itineraryId, {
      collaborators: trip.collaborators,
    });

    return updated.collaborators;
  }

  async addStop(itineraryId, callerUserId, dayNumber, stopData) {
    const trip = await itineraryRepository.findById(itineraryId);
    if (!trip) {
      const err = new Error('Itinerary not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const callerMember = trip.collaborators?.find((c) => c.userId === callerUserId);
    if (!callerMember || (callerMember.role !== 'OWNER' && callerMember.role !== 'EDITOR')) {
      const err = new Error('Viewers do not have permission to edit itinerary items');
      err.code = 'FORBIDDEN';
      err.statusCode = 403;
      throw err;
    }

    const day = trip.days.find((d) => d.dayNumber === parseInt(dayNumber, 10));
    if (!day) {
      const err = new Error('Specified day does not exist in itinerary');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const newStopId = crypto.randomUUID();
    const orderIndex = day.items.length;

    if (day.items.length > 0) {
      const prevStop = day.items[day.items.length - 1];
      if (prevStop.location?.coordinates && stopData.location?.coordinates) {
        const distKm = calculateHaversineDistance(
          prevStop.location.coordinates,
          stopData.location.coordinates
        );
        prevStop.transitToNext = {
          mode: 'DRIVING',
          distanceMeters: Math.round(distKm * 1000),
          durationMinutes: estimateTransitTime(distKm, 'DRIVING'),
        };
      }
    }

    day.items.push({
      id: newStopId,
      orderIndex,
      ...stopData,
    });

    const updated = await itineraryRepository.update(itineraryId, {
      days: trip.days,
    });

    return updated;
  }

  async reorderStops(itineraryId, callerUserId, dayNumber, itemIds) {
    const trip = await itineraryRepository.findById(itineraryId);
    if (!trip) {
      const err = new Error('Itinerary not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const callerMember = trip.collaborators?.find((c) => c.userId === callerUserId);
    if (!callerMember || (callerMember.role !== 'OWNER' && callerMember.role !== 'EDITOR')) {
      const err = new Error('Viewers do not have permission to edit itinerary items');
      err.code = 'FORBIDDEN';
      err.statusCode = 403;
      throw err;
    }

    const day = trip.days.find((d) => d.dayNumber === parseInt(dayNumber, 10));
    if (!day) {
      const err = new Error('Specified day does not exist in itinerary');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const itemMap = new Map(day.items.map((item) => [item.id, item]));
    const reordered = itemIds.map((id) => itemMap.get(id)).filter(Boolean);

    for (let i = 0; i < reordered.length; i++) {
      reordered[i].orderIndex = i;
      if (i < reordered.length - 1) {
        const current = reordered[i];
        const next = reordered[i + 1];
        if (current.location?.coordinates && next.location?.coordinates) {
          const distKm = calculateHaversineDistance(
            current.location.coordinates,
            next.location.coordinates
          );
          current.transitToNext = {
            mode: 'DRIVING',
            distanceMeters: Math.round(distKm * 1000),
            durationMinutes: estimateTransitTime(distKm, 'DRIVING'),
          };
        }
      } else {
        delete reordered[i].transitToNext;
      }
    }

    day.items = reordered;

    const updated = await itineraryRepository.update(itineraryId, {
      days: trip.days,
    });

    return updated;
  }

  async deleteItinerary(itineraryId, callerUserId) {
    const trip = await itineraryRepository.findById(itineraryId);
    if (!trip) {
      const err = new Error('Itinerary not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const callerMember = trip.collaborators?.find((c) => c.userId === callerUserId);
    if (!callerMember || callerMember.role !== 'OWNER') {
      const err = new Error('Only the OWNER can delete this itinerary');
      err.code = 'FORBIDDEN';
      err.statusCode = 403;
      throw err;
    }

    await itineraryRepository.delete(itineraryId);
    return true;
  }
}

module.exports = new ItineraryService();
