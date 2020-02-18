const {query, body, oneOf} = require('express-validator');

const quantityCheck = (val, {req}) => {
    if ( val !== null && val !== 'null' && Number.isNaN(val)) {
        throw new Error('Invalid value')
    }
    req.body.quantity = val === null || val === 'null' ? null : Number(val) ;
    return true;
};

const getRules =  [
    query('page').optional().toInt().isInt({min: 1}),
    query('itemsPerPage').optional({checkFalsy: true}).toInt().isInt(),
    query('search').optional().trim().escape(),
];

const createRules =  [
    body('name').exists({checkFalsy: true}).trim().not().isEmpty().escape().isString().isLength({min: 2, max: 60}),
    body('selectionType').exists().trim().escape().not().isEmpty().isIn(['single', 'multiple']),
    body('isRequired').exists().trim().escape().not().isEmpty().toBoolean(),
    body('quantity').exists().bail().custom(quantityCheck),
    body('options').exists().not().isEmpty().isArray(),
    body('options.*').exists().toInt().isInt({min: 1})
];

const updateRules = oneOf([
    body('name').exists({checkFalsy: true}).bail().trim().escape().isString().isLength({min: 2, max: 60}),
    body('selectionType').exists().not().isEmpty().isIn(['single', 'multiple']),
    body('isRequired').exists().not().isEmpty().toBoolean(),
    body('quantity').optional().custom(quantityCheck),
    body('options').exists().not().isEmpty().isArray(),
    body('options.*').exists().toInt().isInt({min: 1})
], 'Nothing updated, wrong passed data.');

module.exports = {getRules, createRules, updateRules};

