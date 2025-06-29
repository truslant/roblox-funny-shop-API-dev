const dotenv = require('dotenv');
dotenv.config();

const helmet = require('helmet');

const express = require('express');
const app = express();

const rootRouter = require('./routes/rootRouter');

app.use(helmet());
app.use(express.urlencoded());
app.use(express.json());

app.use(rootRouter);

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`)
});

