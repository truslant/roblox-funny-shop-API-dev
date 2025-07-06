// const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const { session, sessionConfig } = require('./db/session/pgSessionConfig')

const { sequelize } = require('./db/database');

const passport = require('./db/auth/passport');

sequelize.authenticate()
    .then(() => {
        console.log('DB connection established')
    })
    .catch(err => {
        console.log('DB connection error: ', err);
    })

const helmet = require('helmet');
const express = require('express');
const app = express();

app.use(helmet());
app.use(session(sessionConfig));
app.use(express.urlencoded());
app.use(express.json());

// const passport = require('passport');
// const PassportLocalStrategy = require('passport-local').Strategy;

// const { User } = require('./db/database');

app.use(passport.initialize());
app.use(passport.session());

const rootRouter = require('./routes/rootRouter');

app.use(rootRouter);

const port = process.env.PORT || 3001
app.listen(port, () => {
    // console.log(crypto.randomBytes(32).toString('hex'));
    console.log(`Server is running on port ${port}...`)
});

