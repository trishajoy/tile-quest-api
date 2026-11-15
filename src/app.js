// Builds the Express app. Does NOT start listening - server.js does that.
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');

const app = express();

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: (origin, done) => done(null, !origin || env.corsOrigins.includes(origin)) }));
app.use(express.json());

// Hub Contract: every endpoint lives under /api/v1
app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
