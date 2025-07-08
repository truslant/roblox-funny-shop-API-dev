const dotenv = require('dotenv');
dotenv.config();

const session = require('express-session');
const PgSessionStore = require('connect-pg-simple')(session);
const { Pool } = require('pg');

const pgSessionPoolConfig = {
    user: process.env.USER_NAME,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
    connectionTimeoutMillis: 2 * 1000,
    idleTimeoutMillis: 30 * 1000,
    max: 20,
    min: 2,
}

const pgSessionPool = new Pool(pgSessionPoolConfig);
// pgSessionPool.on('connect', () => console.log('New connection established'));
// pgSessionPool.on('acquire', () => console.log('Connection acquired'));
// pgSessionPool.on('release', () => console.log('Connection released'));


const pgSessionStoreConfig = {
    pool: pgSessionPool,
    createTableIfMissing: true,
    ttl: 24 * 60 * 60 * 1000,
}

const pgSessionStore = new PgSessionStore(pgSessionStoreConfig);

const sessionConfig = {
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: true,
    store: pgSessionStore,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
    },
}

module.exports = { session, sessionConfig };