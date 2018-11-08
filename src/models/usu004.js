const sqlGetUsuario = `select bous04cod as id, lower(bous04nome) as nome from USU004 where bous04cod = ?`;

const sqlLogin = `select bous04cod as id, lower(bous04nome) as nome, bous04senha as senha, bous04grupo as grupo from USU004
  where bous04cod = ? and bous04senha = ?`;

const usu004 = dbquery => ({

  getById: id => dbquery(sqlGetUsuario, [id]).then(rows => rows[0]),

  getByIdSenha: ({ id, senha }) => dbquery(sqlLogin, [id, senha]).then(rows => rows[0])
  
});

module.exports = usu004;