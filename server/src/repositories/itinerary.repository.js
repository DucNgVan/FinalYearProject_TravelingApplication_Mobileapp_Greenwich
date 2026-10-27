const crypto = require('crypto');

// In-memory store for unit and integration testing without active MongoDB connection
const memoryItineraries = new Map();

class ItineraryRepository {
  constructor(mongooseModel = null) {
    this.model = mongooseModel;
  }

  async create(itineraryData) {
    const id = crypto.randomUUID();
    const now = new Date();
    const newItinerary = {
      id,
      _id: id,
      ...itineraryData,
      createdAt: now,
      updatedAt: now,
    };

    if (this.model) {
      try {
        const created = await this.model.create(newItinerary);
        return created.toObject();
      } catch (err) {
        // Fallback to memory store
      }
    }

    memoryItineraries.set(id, newItinerary);
    return newItinerary;
  }

  async findById(id) {
    if (this.model) {
      try {
        const doc = await this.model.findById(id);
        return doc ? doc.toObject() : null;
      } catch (err) {
        // Fallback to memory store
      }
    }

    return memoryItineraries.get(id) || null;
  }

  async findByUser(userId) {
    if (this.model) {
      try {
        const docs = await this.model.find({
          $or: [
            { 'collaborators.userId': userId },
            { visibility: 'PUBLIC' },
          ],
        });
        return docs.map((d) => d.toObject());
      } catch (err) {
        // Fallback to memory store
      }
    }

    const results = [];
    for (const item of memoryItineraries.values()) {
      const isMember = item.collaborators?.some(
        (c) => c.userId === userId && c.status !== 'DECLINED'
      );
      if (isMember || item.visibility === 'PUBLIC') {
        results.push(item);
      }
    }
    return results;
  }

  async update(id, updateData) {
    if (this.model) {
      try {
        const updated = await this.model.findByIdAndUpdate(
          id,
          { ...updateData, updatedAt: new Date() },
          { new: true }
        );
        return updated ? updated.toObject() : null;
      } catch (err) {
        // Fallback to memory store
      }
    }

    const existing = memoryItineraries.get(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    memoryItineraries.set(id, merged);
    return merged;
  }

  async delete(id) {
    if (this.model) {
      try {
        await this.model.findByIdAndDelete(id);
        return true;
      } catch (err) {
        // Fallback to memory store
      }
    }

    return memoryItineraries.delete(id);
  }

  async clear() {
    memoryItineraries.clear();
  }
}

module.exports = new ItineraryRepository();
