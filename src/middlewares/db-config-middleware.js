const dbParams = require('../config/db-params.json');
const { decodeToken } = require('../utils/auth-token-utils');

const dbConfigMiddleware = (req, res, next) => {
  if (req.url.indexOf('/login') !== -1) {
    req.appContext = {
      dbConfig: dbParams
    }; 
    return next();
  }
  
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).json({ message: 'Autorização não informada' });
  }

  const tokenDecoded = decodeToken(authorization);
  
  if (!tokenDecoded) {
    return res.status(403).json({ message: 'Autorização inválida' });
  }

  req.appContext = {
    dbConfig: tokenDecoded.dbConfig,
    tokenDecoded
  };
  next();
};

module.exports = () => dbConfigMiddleware;