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
    orderIndex: { type: Number, default: 0 },
    activityType: {
      type: String,
      default: 'ATTRACTION',
    },
    title: { type: String },
    name: { type: String },
    category: { type: String },
    time: { type: String },
    duration: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    location: {
      type: locationSchema,
      default: () => ({ name: 'Default', address: 'Default', coordinates: { lat: 0, lng: 0 } }),
    },
    cost: { type: Number, default: 0 },
    notes: { type: String },
    transitToNext: { type: transitSchema },
  },
  { _id: false, strict: false }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, default: 1 },
    dayIndex: { type: Number, default: 1 },
    date: { type: String },
    distanceKm: { type: Number, default: 0 },
    items: [itineraryItemSchema],
  },
  { _id: false, strict: false }
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

const packingItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    assignee: { type: String, default: 'All Squad' },
    checked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
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
    country: { type: String, default: 'Việt Nam' },
    coverImage: { type: String },
    travelMode: { type: String, enum: ['solo', 'group'], default: 'solo' },
    travelersCount: { type: Number, default: 1 },
    budgetPerPerson: { type: Number, default: 0 },
    status: { type: String, default: 'Ready' },
    collaborators: [collaboratorSchema],
    days: [itineraryDaySchema],
    packingList: [packingItemSchema],
  },
  { timestamps: true }
);

itinerarySchema.index({ 'collaborators.userId': 1 });
itinerarySchema.index({ destinationCity: 1, visibility: 1 });

module.exports = mongoose.models.Itinerary || mongoose.model('Itinerary', itinerarySchema);
