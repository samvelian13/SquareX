const express = require('express');
const Drink = require('../../middlewares/rules/drink');
const validator = require('../../middlewares/validator');
const MobileController = require('../../controllers/MobileController');

const router = express.Router();

router.route('/drinks').get(
    Drink.getRules,
    validator.errorsCheck,
    MobileController.get
);

module.exports = router;
