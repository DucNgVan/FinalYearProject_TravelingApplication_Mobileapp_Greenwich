const crypto = require('crypto');
const itineraryRepository = require('../repositories/itinerary.repository');
const userRepository = require('../repositories/user.repository');
const { calculateHaversineDistance, estimateTransitTime } = require('../utils/geo.util');

class ItineraryService {
  async createItinerary(userIdOrData, dataPayload) {
    let userId = userIdOrData;
    let data = dataPayload;
    if (typeof userIdOrData === 'object' && !dataPayload) {
      data = userIdOrData;
      userId = data.userId || 'anonymous-user';
    }
    const {
      title,
      destinationCity,
      destination,
      startDate,
      endDate,
      visibility = 'PRIVATE',
      budget,
      country,
      coverImage,
      daysCount,
      travelMode,
      travelersCount,
      budgetPerPerson,
      status = 'Ready',
      days: incomingDays,
    } = data;
    const dest = destinationCity || destination || 'Da Nang';

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      const err = new Error('Validation Error: endDate must be greater than or equal to startDate');
      err.code = 'VALIDATION_ERROR';
      err.statusCode = 400;
      throw err;
    }

    const totalDays = daysCount || Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

    let days = [];
    if (Array.isArray(incomingDays) && incomingDays.length > 0) {
      days = incomingDays;
    } else {
      for (let i = 1; i <= totalDays; i++) {
        const dayDate = new Date(start);
        dayDate.setDate(start.getDate() + (i - 1));
        days.push({
          dayNumber: i,
          date: dayDate.toISOString().split('T')[0],
          items: [],
        });
      }
    }

    const collaborators = [
      {
        userId,
        role: 'OWNER',
        status: 'ACCEPTED',
        joinedAt: new Date(),
      },
    ];

    const normalizedBudget =
      typeof budget === 'number'
        ? { total: budget, currency: 'VND' }
        : (budget || { total: 0, currency: 'VND' });

    const newTrip = await itineraryRepository.create({
      title,
      destinationCity: dest,
      startDate,
      endDate,
      totalDays,
      visibility,
      budget: normalizedBudget,
      country: country || 'Việt Nam',
      coverImage: coverImage || null,
      travelMode: travelMode || 'solo',
      travelersCount: travelersCount || 1,
      budgetPerPerson: budgetPerPerson || 0,
      status,
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

  async inviteCollaborator(itineraryId, callerUserId, { userId, email, role = 'VIEWER' }) {
    let targetUserId = userId;
    if (!targetUserId && email) {
      const user = await userRepository.findByEmail(email);
      targetUserId = user ? user.id : email;
    }

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

    const existingIndex = trip.collaborators.findIndex((c) => c.userId === targetUserId);
    if (existingIndex >= 0) {
      trip.collaborators[existingIndex].role = role;
      trip.collaborators[existingIndex].status = 'PENDING';
    } else {
      trip.collaborators.push({
        userId: targetUserId,
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

    const parsed = parseInt(dayNumber, 10);
    const day = trip.days.find((d) => d.dayNumber === parsed) || (parsed === 0 ? trip.days[0] : null);
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

    const parsed = parseInt(dayNumber, 10);
    const day = trip.days.find((d) => d.dayNumber === parsed) || (parsed === 0 ? trip.days[0] : null);
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

  async getPackingList(tripId) {
    const trip = await itineraryRepository.findById(tripId);
    if (!trip) {
      const err = new Error('Itinerary not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }
    return trip.packingList || [];
  }

  async addPackingItem(tripId, itemData) {
    const trip = await itineraryRepository.findById(tripId);
    if (!trip) {
      const err = new Error('Itinerary not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const newItem = {
      id: itemData.id || `pck-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      title: itemData.title,
      category: itemData.category || 'General',
      assignee: itemData.assignee || 'All Squad',
      checked: !!itemData.checked,
      createdAt: new Date().toISOString(),
    };

    const currentList = Array.isArray(trip.packingList) ? [...trip.packingList] : [];
    currentList.push(newItem);

    await itineraryRepository.update(tripId, { packingList: currentList });
    return newItem;
  }

  async togglePackingItem(tripId, itemId) {
    const trip = await itineraryRepository.findById(tripId);
    if (!trip) {
      const err = new Error('Itinerary not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const currentList = Array.isArray(trip.packingList) ? [...trip.packingList] : [];
    const itemIndex = currentList.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) {
      const err = new Error('Packing item not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    currentList[itemIndex] = {
      ...currentList[itemIndex],
      checked: !currentList[itemIndex].checked,
    };

    await itineraryRepository.update(tripId, { packingList: currentList });
    return currentList[itemIndex];
  }

  async deletePackingItem(tripId, itemId) {
    const trip = await itineraryRepository.findById(tripId);
    if (!trip) {
      const err = new Error('Itinerary not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const currentList = Array.isArray(trip.packingList) ? [...trip.packingList] : [];
    const filteredList = currentList.filter((i) => i.id !== itemId);

    await itineraryRepository.update(tripId, { packingList: filteredList });
    return { success: true, deletedId: itemId };
  }
}

module.exports = new ItineraryService();
