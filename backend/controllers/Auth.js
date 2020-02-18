const bcrypt = require('bcrypt');
const User = require('../models').User;
const { normalizeResponseData, normalizeErrorResponse, genToken} = require('../helpers/helpersCollection');

async function login(req, res) {
    const {email, password} = req.body;
    let findUser;
    try{
        findUser = await User.findOne({
            where: {
                email,
            },
        });
    }catch(error) {
        return res.status(500).json(normalizeErrorResponse( 'An server error has occurred.313123'));
    }

    const errorMsg = 'Failed to login due to incorrect email or password. Please retry.';

    if (!findUser) {
        return res.status(404).json(normalizeErrorResponse(errorMsg));
    }

    bcrypt.compare(password, findUser.password, function (err, same) {
        if (!same) {
          return res.status(404).json(normalizeErrorResponse(errorMsg));
        }
        const accessToken = genToken({
            email,
            firstName: findUser.firstName,
            lastName: findUser.lastName
        });
        res.send(normalizeResponseData(accessToken));
    })
}

module.exports = {login};
