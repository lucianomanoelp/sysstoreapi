const getDescricaoSistema = status => {  
  if (status === 'C' || status === 'E') 
    return 'CLARO';  

  if (status === 'T' || status === 'I')
    return 'LOJA';         

  return 'VIVO';
};

const sql = `select bopa01servidor as hostDbConfig, bopa01usuario as userDbConfig, 
    bopa01senhab as passwordDbConfig, bopa01banco as databaseDbConfig, bopa01loja as idLoja,
    lower(bopa01nome) as nomeLoja, bopa01cnpj as cnpjLoja, bopa01sta as tipoLoginLoja, 
    bopa01login as userLogin, bopa01senha as passwordLogin
  from SPA001
  where bopa01login = ? and bopa01senha = ? and bopa01sta <> ?`;

const spa001 = dbquery => ({

  getByLoginSenha: ({ login, senha }) => dbquery(sql, [login, senha, 'Y'])
    .then(([rows]) => rows[0])
    .then(row => {
      if (!row) return null;

      return {
        dbConfig: {
          host: row.hostDbConfig,
          user: row.userDbConfig,
          password: row.passwordDbConfig,
          database: row.databaseDbConfig
        },
        loja: {
          id: row.idLoja,
          nome: row.nomeLoja,
          cnpj: row.cnpjLoja,
        },
        geral: (row.tipoLoginLoja === 'E' || row.tipoLoginLoja === 'I') ? true : false,
        sistema: getDescricaoSistema(row.tipoLoginLoja),
        credenciais: {
          login: row.userLogin,
          senha: row.passwordLogin
        }
      };
    })
  
});

module.exports = spa001;