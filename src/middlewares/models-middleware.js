const {
  spa001,
  usu004,
  cp012,
  usu003,
  sp002,
  sp019,
  usu005
} = require('../models');

const modelsMiddleware = (req, res, next) => {  
  const lojas = req.headers.lojas ? JSON.parse(req.headers.lojas) : [];
  const { dbquery } = req.appContext;
  const sistema = req.appContext.tokenDecoded ? req.appContext.tokenDecoded.sistema : '';  

  req.appContext = Object.assign({}, req.appContext, {
    models: {
      spa001: spa001(dbquery),
      usu004: usu004(dbquery),
      cp012: cp012(dbquery),
      usu003: usu003(dbquery),
      sp002: sp002(dbquery, lojas, sistema),
      sp019: sp019(dbquery, lojas),
      usu005: usu005(dbquery)
    }
  });

  next();
};

module.exports = () => modelsMiddleware;