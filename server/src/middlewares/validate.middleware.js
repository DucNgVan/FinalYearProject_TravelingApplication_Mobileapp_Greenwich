const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  fullName: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Full name is required',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const flightSearchSchema = Joi.object({
  origin: Joi.string().length(3).uppercase().required().messages({
    'any.required': 'Origin airport is required',
  }),
  destination: Joi.string()
    .length(3)
    .uppercase()
    .required()
    .disallow(Joi.ref('origin'))
    .messages({
      'any.required': 'Destination airport is required',
      'any.invalid': 'Origin and destination cannot be identical',
    }),
  departureDate: Joi.string()
    .isoDate()
    .required()
    .custom((value, helpers) => {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        return helpers.message('departureDate must be greater than or equal to today');
      }
      return value;
    })
    .messages({
      'any.required': 'departureDate is required',
    }),
  passengers: Joi.number().integer().min(1).max(9).default(1),
  cabinClass: Joi.string().valid('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST').default('ECONOMY'),
  directOnly: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
  maxPrice: Joi.number().positive().optional(),
  sortBy: Joi.string().optional(),
});

const hotelSearchSchema = Joi.object({
  city: Joi.string().min(2).required().messages({
    'any.required': 'Destination city is required',
  }),
  checkIn: Joi.string()
    .isoDate()
    .required()
    .custom((value, helpers) => {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        return helpers.message('checkIn date must be greater than or equal to today');
      }
      return value;
    })
    .messages({
      'any.required': 'checkIn date is required',
    }),
  checkOut: Joi.string()
    .isoDate()
    .required()
    .custom((value, helpers) => {
      const checkIn = helpers.state.ancestors[0]?.checkIn;
      if (checkIn && value <= checkIn) {
        return helpers.message('checkOut date must be after checkIn date');
      }
      return value;
    })
    .messages({
      'any.required': 'checkOut date is required',
    }),
  guests: Joi.number().integer().min(1).max(40).default(2),
  rooms: Joi.number().integer().min(1).max(10).default(1),
  minRating: Joi.number().min(1).max(5).optional(),
  maxPrice: Joi.number().positive().optional(),
  sortBy: Joi.string().optional(),
}).custom((obj, helpers) => {
  if (obj.guests > obj.rooms * 4) {
    return helpers.message('Guest capacity exceeded: Maximum 4 guests per room');
  }
  return obj;
});

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details.map((d) => d.message).join(', '),
          details: error.details.map((d) => ({
            field: d.path.join('.'),
            message: d.message,
          })),
        },
      });
    }
    req.body = value;
    next();
  };
}

function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details.map((d) => d.message).join(', '),
          details: error.details.map((d) => ({
            field: d.path.join('.'),
            message: d.message,
          })),
        },
      });
    }
    req.query = value;
    next();
  };
}

const createItinerarySchema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Title is required',
  }),
  destinationCity: Joi.string().optional(),
  destination: Joi.string().optional(),
  startDate: Joi.string().isoDate().required().messages({
    'any.required': 'startDate is required',
  }),
  endDate: Joi.string().isoDate().required().messages({
    'any.required': 'endDate is required',
  }),
  visibility: Joi.string().valid('PRIVATE', 'PUBLIC').default('PRIVATE'),
  budget: Joi.object({
    total: Joi.number().min(0).default(0),
    currency: Joi.string().default('VND'),
  }).optional(),
}).custom((obj, helpers) => {
  if (!obj.destinationCity && !obj.destination) {
    return helpers.message('Destination city is required');
  }
  if (!obj.destinationCity && obj.destination) {
    obj.destinationCity = obj.destination;
  }
  if (new Date(obj.endDate) < new Date(obj.startDate)) {
    return helpers.message('Validation Error: endDate must be greater than or equal to startDate');
  }
  return obj;
});

const inviteCollaboratorSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'userId is required',
  }),
  role: Joi.string().valid('OWNER', 'EDITOR', 'VIEWER').default('VIEWER'),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('ACCEPTED', 'DECLINED').required().messages({
    'any.required': 'status is required',
  }),
});

const addStopSchema = Joi.object({
  title: Joi.string().min(2).max(150).required().messages({
    'any.required': 'Title is required',
  }),
  activityType: Joi.string()
    .valid('FLIGHT', 'HOTEL', 'ATTRACTION', 'RESTAURANT', 'CUSTOM')
    .default('ATTRACTION'),
  startTime: Joi.string().optional(),
  endTime: Joi.string().optional(),
  location: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    coordinates: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required(),
    }).required(),
  }).required(),
  cost: Joi.number().min(0).optional(),
  notes: Joi.string().max(500).optional(),
});

const reorderSchema = Joi.object({
  itemIds: Joi.array().items(Joi.string()).min(1).required().messages({
    'any.required': 'itemIds array is required',
  }),
});

const placesSearchSchema = Joi.object({
  city: Joi.string().min(1).required().messages({
    'any.required': 'City is required',
  }),
  category: Joi.string().optional(),
  query: Joi.string().allow('').optional(),
});

const placesAiPlanSchema = Joi.object({
  places: Joi.array().items(Joi.object().unknown(true)).min(1).required().messages({
    'any.required': 'places array is required',
  }),
  durationDays: Joi.number().integer().min(1).max(30).default(1),
});

module.exports = {
  validate,
  validateQuery,
  registerSchema,
  loginSchema,
  flightSearchSchema,
  hotelSearchSchema,
  createItinerarySchema,
  inviteCollaboratorSchema,
  updateStatusSchema,
  addStopSchema,
  reorderSchema,
  placesSearchSchema,
  placesAiPlanSchema,
};

