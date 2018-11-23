const { encodeToken } = require('../utils/auth-token-utils');

module.exports = app => {

  app.get('/usuario/:id', (req, res, next) => {
    const { id } = req.params;
    const { usu004 } = req.appContext.models;
    usu004.getById(id)
      .then(usuario => {
        if (!usuario) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json({
          usuario
        });
      })
      .catch(next); 
  });

  app.post('/usuario/auth', (req, res, next) => {
    console.log(req.appContext.tokenDecoded.loja.nome);
    const { id, senha } = Object.keys(req.body).length > 0 ? req.body : req.appContext.tokenDecoded.usuario;
    const { usu004, cp012, usu003 } = req.appContext.models;

    Promise.all([ usu004.getByIdSenha({ id, senha }), cp012.list() ])
      .then(response => ({
        usuario: response[0],
        lojas: response[1]       
      }))
      .then(({ usuario, lojas }) => {
        if (!usuario) {
          return { usuario, lojas };
        }
        
        return usu003.getByIdGrupo(usuario.grupo)
          .then(permissoes => ({
            usuario: Object.assign({}, usuario),
            lojas: lojas.map(loja => Object.assign({}, loja)),
            permissoes: permissoes.map(permissao => Object.assign({}, permissao))
          }))
          .catch(() => ({
            usuario: Object.assign({}, usuario),
            lojas: lojas.map(loja => Object.assign({}, loja)),
          }));          
      })
      .then(({ usuario, lojas, permissoes }) => {
        if (!usuario) {
          return res.status(404).json({ message: 'Credenciais inválidas' });
        }

        const tokenDecoded = Object.assign({}, req.appContext.tokenDecoded, { usuario });
        delete tokenDecoded.iat;
        
        const authToken = encodeToken(tokenDecoded);
        res.status(200).json({ 
          authToken,
          loja: tokenDecoded.loja,
          usuario: Object.assign({}, {
            id: usuario.id,
            nome: usuario.nome
          }),
          geral: tokenDecoded.geral,
          sistema: tokenDecoded.sistema,
          lojas,
          permissoes
        });
      })
      .catch(next);
  });
  
};