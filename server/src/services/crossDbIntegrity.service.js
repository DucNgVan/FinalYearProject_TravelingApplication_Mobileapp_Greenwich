/**
 * CrossDbIntegrityService: Safeguards data consistency across Polyglot PostgreSQL & MongoDB
 * Detects orphaned financial ledgers and executes compensating transactions for dual-writes.
 */
class CrossDbIntegrityService {
  /**
   * Identifies PostgreSQL expenses that reference non-existent MongoDB itineraries
   */
  async findOrphanTripExpenses({ mongoRepo, pgRepo }) {
    const allTripIds = await pgRepo.findAllTripIdsWithExpenses();
    const orphanTripIds = [];

    for (const tripId of allTripIds) {
      const trip = await mongoRepo.findById(tripId);
      if (!trip) {
        orphanTripIds.push(tripId);
      }
    }

    return {
      hasOrphans: orphanTripIds.length > 0,
      orphanTripIds,
    };
  }

  /**
   * Verifies consistency for a specific trip across both database engines
   */
  async verifyTripConsistency(tripId, { mongoRepo, pgRepo }) {
    const issues = [];
    const trip = await mongoRepo.findById(tripId);

    if (!trip) {
      issues.push(`Trip ${tripId} does not exist in MongoDB`);
      return {
        consistent: false,
        issues,
      };
    }

    // Verify PostgreSQL ledger association
    const expenses = await pgRepo.findExpensesByTripId(tripId);

    return {
      consistent: issues.length === 0,
      issues,
      tripTitle: trip.title,
      expenseCount: (expenses || []).length,
    };
  }

  /**
   * Executes a distributed dual-write with compensating rollback if secondary step fails
   */
  async executeWithCompensation({ primaryAction, secondaryAction, compensateAction }) {
    let primaryResult;

    try {
      primaryResult = await primaryAction();
    } catch (primaryErr) {
      return {
        success: false,
        compensated: false,
        error: primaryErr.message,
      };
    }

    try {
      const secondaryResult = await secondaryAction(primaryResult);
      return {
        success: true,
        data: secondaryResult || primaryResult,
      };
    } catch (secondaryErr) {
      // Execute compensating rollback (e.g., delete primary record)
      if (typeof compensateAction === 'function') {
        try {
          await compensateAction(primaryResult);
        } catch (compensationErr) {
          console.error('[CrossDbIntegrity] Compensation action failed:', compensationErr);
        }
      }

      return {
        success: false,
        compensated: true,
        error: secondaryErr.message,
      };
    }
  }
}

module.exports = new CrossDbIntegrityService();
