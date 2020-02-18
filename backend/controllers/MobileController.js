const { normalizeResponseData, normalizeErrorResponse, paginate } = require('../helpers/helpersCollection');
const Drink = require('../models').Drink;
const OptionGroup = require('../models').OptionGroup;
const DrinkOption = require('../models').DrinkOption;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function get(req, res) {
    const { page, itemsPerPage, search } = req.query;
    let options = {
        order: [
            ['updatedAt', 'DESC'],
        ],
        attributes: [
            'id', 'name', 'drinkDescription', 'image', 'thumbnail', 'quantity'
        ],
        include: [
            {
                attributes: [
                    'id', 'name', 'selectionType', 'isRequired', 'quantity'
                ],
                model: OptionGroup,
                as: 'optionGroups',
                through: {attributes: []},
                required: false,
                include: [
                    {
                        attributes: [
                            'id', 'name', 'price', 'quantity'
                        ],
                        model: DrinkOption,
                        as: 'options',
                        through: {attributes: []},
                        required: false,
                    }
                ],
            }
        ],
        subQuery:false
    };

    if(page && itemsPerPage > -1) {
        const {limit, offset} = paginate(page, itemsPerPage);
        options.limit = limit;
        options.offset = offset;
    }
    if (search) {
        options.where = {
            [Op.or]: [
                {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    drinkDescription: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    "$optionGroups.name$" : {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    "$optionGroups.options.name$" : {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    "$optionGroups.options.price$" : {
                        [Op.like]: `%${search}%`
                    }
                }
            ],
        }
    }
    let drinks;
    try {
        drinks = await Drink.findAll(options);
    }catch (error) {
        return res.status(500).json(normalizeErrorResponse( 'An server error has occurred.'));
    }
    if(!drinks.length) {
        return res.status(404).json(normalizeErrorResponse( 'The records not found'));
    }

    return res.status(200).json(normalizeResponseData(drinks));
}

module.exports = { get };
