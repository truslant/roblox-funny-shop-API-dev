const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const logger = require('winston');


const { session, sessionConfig } = require('./db/session/pgSessionConfig')

const { sequelize } = require('./db/database');

const passport = require('./db/auth/passport');

process.on('unhandledRejection', (reason, promise) => {
    logger.error({ message: "Unhandled Rejection", reason, promise });
});

sequelize.authenticate()
    .then(() => {
        console.log('DB connection established')
    })
    .catch(err => {
        logger.error({
            message: err.message || "DB connection error",
            details: err.details || "Not available",
            stack: stackLog || "Not available",
        })
        console.log('DB connection error: ', err);
    })

const helmet = require('helmet');
const express = require('express');
const app = express();

app.use(helmet());
app.use(session(sessionConfig));
app.use(express.urlencoded());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

const rootRouter = require('./routes/rootRouter');

app.use(rootRouter);

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`)
});

