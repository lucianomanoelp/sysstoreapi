const spa001 = require('../models/spa001');
const usu004 = require('../models/usu004');
const cp012 = require('../models/cp012');
const usu003 = require('../models/usu003');

const modelsMiddleware = (req, res, next) => {
  const { dbquery } = req.appContext;
  req.appContext = Object.assign({}, req.appContext, {
    models: {
      spa001: spa001(dbquery),
      usu004: usu004(dbquery),
      cp012: cp012(dbquery),
      usu003: usu003(dbquery),
    }
  });

  next();
};

module.exports = () => modelsMiddleware;