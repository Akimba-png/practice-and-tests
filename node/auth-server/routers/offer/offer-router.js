const Router = require('express');
const OfferController = require('./offer-controller');

const router = new Router();

router.get('/offers', (req, res) => {
  OfferController.getOffers(req, res);
});

module.exports = router;
