const express = require('express');
const itineraryController = require('../controllers/itinerary.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const {
  validate,
  createItinerarySchema,
  inviteCollaboratorSchema,
  updateStatusSchema,
  addStopSchema,
  reorderSchema,
} = require('../middlewares/validate.middleware');

const router = express.Router();

// Base Itinerary CRUD
router.post('/', authenticate, validate(createItinerarySchema), (req, res, next) => {
  itineraryController.create(req, res, next);
});

router.get('/', authenticate, (req, res, next) => {
  itineraryController.getAll(req, res, next);
});

router.get('/:id', authenticate, (req, res, next) => {
  itineraryController.getById(req, res, next);
});

router.delete('/:id', authenticate, (req, res, next) => {
  itineraryController.delete(req, res, next);
});

// Squad Collaboration
router.post(
  '/:id/collaborators',
  authenticate,
  validate(inviteCollaboratorSchema),
  (req, res, next) => {
    itineraryController.invite(req, res, next);
  }
);

router.patch(
  '/:id/collaborators/:userId/status',
  authenticate,
  validate(updateStatusSchema),
  (req, res, next) => {
    itineraryController.updateStatus(req, res, next);
  }
);

// Daily Stops & Reordering
router.post(
  '/:id/days/:dayNumber/items',
  authenticate,
  validate(addStopSchema),
  (req, res, next) => {
    itineraryController.addStop(req, res, next);
  }
);

router.put(
  '/:id/days/:dayNumber/reorder',
  authenticate,
  validate(reorderSchema),
  (req, res, next) => {
    itineraryController.reorder(req, res, next);
  }
);

module.exports = router;
