const dbConfigMiddleware = require('./db-config-middleware');
const dbConnectionMiddleware = require('./db-connection-middleware');
const dbQueryMiddleware = require('./db-query-middleware');
const modelsMiddleware = require('./models-middleware');
const errorMiddleware = require('./error-middleware');

module.exports = {
  dbConfigMiddleware,
  dbConnectionMiddleware,
  dbQueryMiddleware,
  modelsMiddleware,
  errorMiddleware
};