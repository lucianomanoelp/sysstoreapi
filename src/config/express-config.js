const express = require('express');
const bodyParser = require('body-parser');
const dbConfigMiddleware = require('../middlewares/db-config-middleware');
const dbConnectionMiddleware = require('../middlewares/db-connection-middleware');
const dbQueryMiddleware = require('../middlewares/db-query-middleware');
const modelsMiddleware = require('../middlewares/models-middleware');
const errorMiddleware = require('../middlewares/error-middleware');
const app = express();

app.use(bodyParser.json());
app.use(dbConfigMiddleware());
app.use(dbConnectionMiddleware());
app.use(dbQueryMiddleware());
app.use(modelsMiddleware());

require('../routes/login-route')(app);
require('../routes/usuario-route')(app);
require('../routes/acessorios-route')(app);
require('../routes/aparelho-route')(app);
require('../routes/simcard-route')(app);

app.use(errorMiddleware());

module.exports = app;