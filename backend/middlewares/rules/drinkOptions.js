const { query, body, oneOf} = require('express-validator');

const quantityCheck = (val, {req}) => {
    if ( val !== null && val !== 'null' && Number.isNaN(val)) {
        throw new Error('Invalid value')
    }
    req.body.quantity = val === null || val === 'null' ? null : Number(val) ;
    return true;
};

const getRules = [
    query('page').optional().bail().toInt().isInt({min: 1}),
    query('itemsPerPage').optional({checkFalsy: true}).bail().toInt().isInt(),
    query('search').optional().bail().trim().escape(),
];

const createRules =  [
    body('name').exists({checkFalsy: true}).bail().trim().escape().isString().isLength({min: 2, max: 60}),
    body('price').optional().trim().toFloat().escape(),
    body('quantity').exists().bail().custom(quantityCheck),
];

const updateRules = oneOf([
    body('name').exists({checkFalsy: true}).bail().trim().escape().isString().isLength({min: 2, max: 60}),
    body('price').exists().toFloat().escape(),
    body('quantity').optional().custom(quantityCheck)
], 'Nothing updated, wrong passed data.');

module.exports = {getRules, createRules, updateRules};

