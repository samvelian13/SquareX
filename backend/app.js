const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./routes');
const mobileRoutes = require('./routes/mobile');
const authRoutes = require('./routes/auth.route');
const { jwtMiddleware } = require('./middlewares/auth');

const app = express();

const corsOptions= {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    headers: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Content-Security-Policy", "default-src 'self';script-src 'self'; object-src 'none';img-src 'self';media-src 'self';frame-src 'none';font-src * data:; connect-src 'self';style-src * 'unsafe-inline'");
    return next();
});
app.use('/uploads/', express.static(__dirname + '/public/uploads'));
app.use('/mobile', mobileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', jwtMiddleware, apiRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/public/dist'));
    app.get(/.*/, (req, res) => {
        res.header("Content-Security-Policy", "default-src 'self';script-src 'self'; object-src 'none';img-src 'self';media-src 'self';frame-src 'none';font-src * data:; connect-src 'self';style-src * 'unsafe-inline'");
        res.sendFile(path.resolve(__dirname, 'public', 'dist', 'index.html'));
    });
}
module.exports = app;

