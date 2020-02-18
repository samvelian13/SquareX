const { query, check, body, oneOf} = require('express-validator');

const optionGroupsCheck = (val, {req, location, path}) => {
    const fromFormData = typeof val === 'string';
    const opGroups = fromFormData ? val.split(',').map(Number): val;
    const isIntElements = opGroups.every((num) => !isNaN(num) && num > 0);
    if(isIntElements) {
        if (fromFormData) {
            req[location][path] = opGroups;
        }
        return true
    } else {
        throw new Error('Option Groups invalid value(s)');
    }
};

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
    body('drinkDescription').exists({checkFalsy: true}).trim().escape().not().isEmpty().isString(),
    body('quantity').exists().bail().custom(quantityCheck),
    body('optionGroups').exists().not().isEmpty().custom(optionGroupsCheck),
];

const updateRules = oneOf([
    body('name').exists({checkFalsy: true}).not().isEmpty().bail().isString().isLength({min: 2, max: 60}).trim().escape(),
    body('drinkDescription').exists({checkFalsy: true}).isLength({max: 150}).bail().trim().escape(),
    body('quantity').optional().custom(quantityCheck),
    check('file').custom((v, {req}) => {
        return !!req.file;
    }),
    body('optionGroups').exists().not().isEmpty().bail().custom(optionGroupsCheck),
], 'Nothing updated, wrong passed data.');

module.exports = {getRules, createRules, updateRules};

