const bookingService = require('../services/booking.service');

class FlightController {
  async search(req, res, next) {
    try {
      const result = await bookingService.searchFlights(req.query);
      return res.status(200).json({
        success: true,
        data: {
          flights: result.flights,
        },
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FlightController();
