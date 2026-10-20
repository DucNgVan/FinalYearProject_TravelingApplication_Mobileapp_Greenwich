const bookingService = require('../services/booking.service');

class HotelController {
  async search(req, res, next) {
    try {
      const result = await bookingService.searchHotels(req.query);
      return res.status(200).json({
        success: true,
        data: {
          hotels: result.hotels,
        },
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HotelController();
