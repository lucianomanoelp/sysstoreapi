const sql = `select bous05vchip as precoChip from USU005 where bous05vchip > 0 limit 1`;

const usu005 = dbquery => ({

  getPrecoChip: ()  => dbquery(sql).then(rows => rows[0])
  
});

module.exports = usu005;