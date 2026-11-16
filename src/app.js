// Builds the Express app. Does NOT start listening - server.js does that.
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const env = require('./config/env');
const routes = require('./routes');
const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');

const app = express();

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: (origin, done) => done(null, !origin || env.corsOrigins.includes(origin)) }));
if (env.nodeEnv !== 'test') app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.json());
app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
