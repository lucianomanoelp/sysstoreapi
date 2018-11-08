const mysql = require('mysql2/promise');

const dbConnectionMiddleware = (req, res, next) => {
  const { host, user, password, database } = req.appContext.dbConfig;
  mysql.createConnection({ host, user, password, database, charset: 'utf8_general_ci' })
    .then(conn => {
      req.appContext = Object.assign({}, req.appContext, { dbConnection: conn });
      next(); 
    })
    .catch(err => {
      res.status(500).json({ message: 'Falha na conexão com o banco de dados' });      
    });
};

module.exports = () => dbConnectionMiddleware;