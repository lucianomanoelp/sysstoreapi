const { getInitialPoint } = require('../utils/paginated-response-utils');

const sqlTotal = (sqlClaroItens, lojas) => new Promise((resolve) => resolve(
  'select sum(total) as total from ('
  .concat(lojas.map(loja => `
    select count(bocp12cod) as total, bocp12cod from SP002
    inner join CP012 on bocp12cod = ${loja.id}
    inner join SP099 on bosp99item = bosp02item and bosp99loja = bocp12cod and bosp99saldo > 0
    where bosp02desc like ? and bosp02item <> 5001 ${sqlClaroItens}`)
  .join(' union '))
  .concat(') as totais')
));

const sqlAcessorios = (sqlClaroItens, lojas, initial, limit) => new Promise((resolve) => resolve(
  'select id, descricao, quantidade, idLoja, nomeLoja, cnpjLoja from ('
  .concat(lojas.map(loja => `
    select bosp02item as id, lower(bosp02desc) as descricao, bosp99saldo as quantidade,
      bocp12cod as idLoja, lower(bocp12nome) as nomeLoja, bocp12cnpj as cnpjLoja from SP002
    inner join CP012 on bocp12cod = ${loja.id}
    inner join SP099 on bosp99item = bosp02item and bosp99loja = bocp12cod and bosp99saldo > 0
    where bosp02desc like ? and bosp02item <> 5001 ${sqlClaroItens}
  `)
  .join(' union '))
  .concat(`) as acessorios order by descricao, idLoja limit ${initial},${limit}`)
));

const createResponse = ({ total, rows }) => ({
  total,
  itens: rows.map(acessorio => ({
      id: acessorio.id,
      descricao: acessorio.descricao,
      quantidade: acessorio.quantidade,
      loja: {
        id: acessorio.idLoja,
        nome: acessorio.nomeLoja,
        cnpj: acessorio.cnpjLoja
      }
    })
  )
});

const sp002 = (dbquery, lojas, sistema) => {
  const sqlClaroItens = sistema === 'CLARO' ? ' and bosp02grupo > 1 ' : '';

  return {
    list: (page, limit, filter = '') => {
      const paramFilter = lojas.map(() => `%${filter}%`);

      return sqlTotal(sqlClaroItens, lojas)
        .then(sql => dbquery(sql, paramFilter).then(rows => rows[0]))      
        .then(({ total }) => getInitialPoint(page, limit).then(initial => ({ total, initial })))
        .then(({ total, initial }) => sqlAcessorios(sqlClaroItens, lojas, initial, limit).then(sql => ({ total, sql })))
        .then(({ total, sql }) => dbquery(sql, paramFilter).then(rows => ({ total, rows })))
        .then(createResponse);
    }
  };
};

module.exports = sp002;