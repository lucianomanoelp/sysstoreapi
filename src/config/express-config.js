const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
  dbConfigMiddleware,
  dbConnectionMiddleware,
  dbQueryMiddleware,
  modelsMiddleware,
  errorMiddleware
} = require('../middlewares');

const app = express();

app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization', 'Lojas']
}));
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