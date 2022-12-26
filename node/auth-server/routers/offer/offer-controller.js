const { DbOffer } = require('./../../db');

class OfferController {
  static getOffers(req, res) {
    res.json(DbOffer.getAll());
  }
}

module.exports = OfferController;
