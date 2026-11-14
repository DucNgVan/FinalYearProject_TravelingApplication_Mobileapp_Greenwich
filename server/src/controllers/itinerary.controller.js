const itineraryService = require('../services/itinerary.service');

class ItineraryController {
  async create(req, res, next) {
    try {
      const trip = await itineraryService.createItinerary(req.user.userId, req.body);
      return res.status(201).json({
        success: true,
        data: {
          itinerary: trip,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const trips = await itineraryService.getUserItineraries(req.user.userId);
      return res.status(200).json({
        success: true,
        data: {
          itineraries: trips,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const trip = await itineraryService.getItineraryById(req.params.id, req.user.userId);
      return res.status(200).json({
        success: true,
        data: {
          itinerary: trip,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async invite(req, res, next) {
    try {
      const collaborators = await itineraryService.inviteCollaborator(
        req.params.id,
        req.user.userId,
        req.body
      );
      return res.status(200).json({
        success: true,
        data: {
          collaborators,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const collaborators = await itineraryService.updateCollaboratorStatus(
        req.params.id,
        req.params.userId,
        req.body.status
      );
      return res.status(200).json({
        success: true,
        data: {
          collaborators,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async addStop(req, res, next) {
    try {
      const updated = await itineraryService.addStop(
        req.params.id,
        req.user.userId,
        req.params.dayNumber,
        req.body
      );
      return res.status(201).json({
        success: true,
        data: {
          itinerary: updated,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async reorder(req, res, next) {
    try {
      const updated = await itineraryService.reorderStops(
        req.params.id,
        req.user.userId,
        req.params.dayNumber,
        req.body.itemIds
      );
      return res.status(200).json({
        success: true,
        data: {
          itinerary: updated,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await itineraryService.deleteItinerary(req.params.id, req.user.userId);
      return res.status(200).json({
        success: true,
        data: {
          message: 'Itinerary deleted successfully',
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getPackingList(req, res, next) {
    try {
      const items = await itineraryService.getPackingList(req.params.id);
      return res.status(200).json({
        success: true,
        data: items,
      });
    } catch (err) {
      next(err);
    }
  }

  async addPackingItem(req, res, next) {
    try {
      const item = await itineraryService.addPackingItem(req.params.id, req.body);
      return res.status(201).json({
        success: true,
        data: item,
      });
    } catch (err) {
      next(err);
    }
  }

  async togglePackingItem(req, res, next) {
    try {
      const item = await itineraryService.togglePackingItem(req.params.id, req.params.itemId);
      return res.status(200).json({
        success: true,
        data: item,
      });
    } catch (err) {
      next(err);
    }
  }

  async deletePackingItem(req, res, next) {
    try {
      const result = await itineraryService.deletePackingItem(req.params.id, req.params.itemId);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ItineraryController();
