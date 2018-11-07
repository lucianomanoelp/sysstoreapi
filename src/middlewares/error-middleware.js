const errorMiddleware = (err, req, res, next) => {  
  console.log(`LOG DE FALHA INTERNA DO SERVIDOR: ${req.url}`);
  console.error(err.stack);
  res.status(500).json({ message: 'Falha interna no servidor' });
};

module.exports = () => errorMiddleware;