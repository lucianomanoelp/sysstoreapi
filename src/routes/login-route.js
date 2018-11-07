const { encodeToken } = require('../utils/auth-token-utils');

module.exports = app => {
  
  app.post('/login', (req, res, next) => {
    const { login, senha } = req.body;
    const { spa001 } = req.appContext.models;
    spa001.getByLoginSenha({ login, senha })
      .then(response => {
        if (!response) {
          return res.status(403).json({ message: 'Login ou senha inválidos' });
        }
        const authToken = encodeToken(response);        
        return res.status(200).json({ authToken });
      })
      .catch(next); 
  });

};