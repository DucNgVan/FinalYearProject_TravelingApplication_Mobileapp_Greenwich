const mongoose = require('mongoose');

const transitSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ['DRIVING', 'WALKING', 'TRANSIT'],
      default: 'DRIVING',
    },
    distanceMeters: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 0 },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { _id: false }
);

const itineraryItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    orderIndex: { type: Number, required: true },
    activityType: {
      type: String,
      enum: ['FLIGHT', 'HOTEL', 'ATTRACTION', 'RESTAURANT', 'CUSTOM'],
      default: 'ATTRACTION',
    },
    title: { type: String, required: true },
    startTime: { type: String },
    endTime: { type: String },
    location: { type: locationSchema, required: true },
    cost: { type: Number, default: 0 },
    notes: { type: String },
    transitToNext: { type: transitSchema },
  },
  { _id: false }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true },
    date: { type: String, required: true },
    items: [itineraryItemSchema],
  },
  { _id: false }
);

const collaboratorSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    role: {
      type: String,
      enum: ['OWNER', 'EDITOR', 'VIEWER'],
      default: 'VIEWER',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'DECLINED'],
      default: 'PENDING',
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    destinationCity: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalDays: { type: Number, required: true },
    visibility: {
      type: String,
      enum: ['PRIVATE', 'PUBLIC'],
      default: 'PRIVATE',
    },
    budget: {
      total: { type: Number, default: 0 },
      currency: { type: String, default: 'VND' },
    },
    collaborators: [collaboratorSchema],
    days: [itineraryDaySchema],
  },
  { timestamps: true }
);

itinerarySchema.index({ 'collaborators.userId': 1 });
itinerarySchema.index({ destinationCity: 1, visibility: 1 });

module.exports = mongoose.models.Itinerary || mongoose.model('Itinerary', itinerarySchema);
