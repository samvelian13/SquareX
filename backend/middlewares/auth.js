const jwt = require('jsonwebtoken');
const { getToken, normalizeErrorResponse} = require('../helpers/helpersCollection');
const jwtSecret = require('../config').jwtSecret;

const jwtMiddleware = (req, res, next) => {
    let token  = getToken(req);
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                res.status(401).json(normalizeErrorResponse('Unauthorized, please login'))
            } else {
                next();
            }
        });
    } else {
        res.status(401).json(normalizeErrorResponse('Unauthorized, please login'))
    }
};

module.exports = { jwtMiddleware };
