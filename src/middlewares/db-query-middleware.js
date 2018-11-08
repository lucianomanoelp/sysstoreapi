const dbquery = dbConnection => (sql, params) => dbConnection.execute(sql, params)
  .then(([rows]) => rows)
  .catch(err => {
    console.log(err);
    throw new Error('Falha interna do servidor');
  });

const dbQueryMiddleware = (req, res, next) => {
  const { dbConnection } = req.appContext;
  req.appContext = Object.assign({}, req.appContext, { dbquery: dbquery(dbConnection) });
  next();
};

module.exports = () => dbQueryMiddleware;