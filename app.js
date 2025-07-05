// const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const { session, sessionConfig } = require('./db/session/pgSessionConfig')

const { sequelize } = require('./db/database');

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

const rootRouter = require('./routes/rootRouter');

app.use(helmet());
app.use(session(sessionConfig));
app.use(express.urlencoded());
app.use(express.json());

app.use(rootRouter);

const port = process.env.PORT || 3001
app.listen(port, () => {
    // console.log(crypto.randomBytes(32).toString('hex'));
    console.log(`Server is running on port ${port}...`)
});

