require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { checkUser, requireAuth } = require('./middleware/auth');
const cors = require('cors');
const helmet = require('helmet');


// Connect to our Database
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.c6tal.mongodb.net/p7-project`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log('Connexion à MongoDB échouée !', error));

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}

app.use(cors(corsOptions));
app.use(helmet({
    crossOriginResourcePolicy : false
}))

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => res.status(200).send(res.locals.user._id));

// routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

module.exports = app;