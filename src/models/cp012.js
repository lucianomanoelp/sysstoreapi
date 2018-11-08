const sql = `select bocp12cod as id, lower(bocp12nome) as nome, bocp12cnpj as cnpj from CP012 order by bocp12cod`;

const cp012 = dbquery => ({

  list: ()  => dbquery(sql)
  
});

module.exports = cp012;