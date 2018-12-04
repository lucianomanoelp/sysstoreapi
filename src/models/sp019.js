const { getInitialPoint } = require('../utils/paginated-response-utils');

const sqlResumoGeral = ({ lojas, dataInicial, dataFinal }) => new Promise((resolve) => resolve(
  lojas.map(loja => 
    `select bosp19aparelho, bosp19imei, bosp19item, bosp19data_compra, bosp19data_venda, 
    bosp19iccid, bosp19tipo, bosp19comis, bosp19venda, bosp19rebate, bosp19plano, bosp19tec,
    bosp19nota, bosp19deb, bosp19vlprice, bosp19vldeb, bosp19vlbonus, bosp19txcart, bosp19loja,
    bosp19notantc, bosp19promoc, bosp19dt_alter, bosp19sta, bosp19lcnpj, bosp19combo, bosp19nota_venda,
    bosp20tipo, bosp20claro, bosp26ativa, bosp26ativa, bosp26interno, bosp14plano_ant, bosp14imei_lc, 
    bosp14vend, bocp12cod, bocp12nome, bosp37stac
    from ${loja.cnpj}_SP19
    inner join CP012 on bocp12cnpj = bosp19lcnpj
    inner join SP020 on bosp20cod = bosp19plano
    inner join SP026 on bosp26cod = bosp19tec
    inner join ${loja.cnpj}_SP14 on bosp19data_venda = bosp14data and bosp19item = bosp14item and
      bosp19imei = bosp14imei and bosp19aparelho = bosp14ctn
    left join ${loja.cnpj}_SP37 on bosp19imei = bosp37imei
    where bosp19data_venda >= '${dataInicial.toISOString()}' and
      bosp19data_venda <= '${dataFinal.toISOString()}'`).join(' union ')
));

const sqlTotalAparelhos = lojas => new Promise((resolve) => resolve(
  'select count(*) as total from ('
  .concat(lojas.map(loja => `
    select bosp19item as id, count(bosp19item) as quantidade, bosp19lcnpj as cnpj_loja
    from ${loja.cnpj}_SP19 
    inner join CP012 ON bocp12cnpj = bosp19lcnpj
    left join ${loja.cnpj}_SP37 on bosp19imei = bosp37imei 
    where bosp19imei <> '' and bosp19nota > 0 
      and (bosp19data_venda is null or bosp19virtual = 99) 
      and bosp19loja < 99 and bosp19loja <> 50 and bosp19loja <> 51
      and (BOSP19data_en is null or bosp19promoc <= 0)
      and bosp19nome_item like ?
    group by bosp19item, bosp19nome_item, bosp19lcnpj
    having quantidade > 0`)
  .join(' union '))  
  .concat(') as totais')
));

const sqlAparelhos = (lojas, initial, limit) => new Promise((resolve) => resolve(
  'select id, descricao, quantidade, id_loja, nome_loja, cnpj_loja from ('
  .concat(lojas.map(loja => `
    select bosp19item as id, lower(bosp19nome_item) as descricao, count(bosp19item) as quantidade, 
      bocp12cod as id_loja, lower(bocp12nome) as nome_loja, bocp12cnpj as cnpj_loja
    from ${loja.cnpj}_SP19 
    inner join CP012 ON bocp12cnpj = bosp19lcnpj
    left join ${loja.cnpj}_SP37 on bosp19imei = bosp37imei 
    where bosp19imei <> '' and bosp19nota > 0 
      and (bosp19data_venda is null or bosp19virtual = 99) 
      and bosp19loja < 99 and bosp19loja <> 50 and bosp19loja <> 51
      and (BOSP19data_en is null or bosp19promoc <= 0)
      and bosp19nome_item like ?
    group by bosp19item, bosp19nome_item, bosp19lcnpj
    having quantidade > 0
  `)
  .join(' union '))
  .concat(`) as aparelhos order by descricao, id_loja limit ${initial},${limit}`)
));

const sqlSimcards = lojas => new Promise((resolve) => resolve(
  'select tipo, descricao, quantidade, id_loja, nome_loja, cnpj_loja from ('
  .concat(lojas.map(loja => `
    select tipo, descricao, count(tipo) as quantidade, id_loja, nome_loja, cnpj_loja from
      (select bosp19tipo as tipo,
        case bosp19tipo
          when 'N' then 'NP'
          when '8' then '128'
          when 'P' then '128NP'
          when 'A' then 'ODA'
          when 'D' then 'Doação'
          when 'd' then 'Doação NP'
          when 'a' then 'Doação ODA'
          when 'S' then 'Micro SIM'
          when 'F' then 'Claro Fixo'
          when 'I' then 'Nano SIM'
          when 'i' then 'Nano SIM Doação'
          when 'E' then 'Embratel'
          when 'X' then 'Flex'
          when 'T' then 'Triple'
          when 'L' then 'Doação Flex'
          when 'B' then 'Doação Triple'
          when 'J' then 'Triple ODA'
          else 'Normal'
        end as descricao,
        bocp12cod as id_loja, lower(bocp12nome) as nome_loja, bocp12cnpj as cnpj_loja
        from ${loja.cnpj}_SP19 
      inner join CP012 on bocp12cnpj = bosp19lcnpj
      where (bosp19imei = ' ' or bosp19imei = '') and bosp19notantc > 0 and bosp19data_venda is null and
        bosp19lojantc <> 50 and bosp19lojantc < 99) as simcards 
    group by tipo, descricao
  `)
  .join(' union '))
  .concat(`) as tabela where descricao like ? order by descricao, id_loja`)
));

const createAparelhosResponse = ({ total, rows }) => ({
  total,
  itens: rows.map(aparelho => ({
      id: aparelho.id,
      descricao: aparelho.descricao,
      quantidade: aparelho.quantidade,
      loja: {
        id: aparelho.id_loja,
        nome: aparelho.nome_loja,
        cnpj: aparelho.cnpj_loja
      }
    })
  )
});

const createSimcardsResponse = rows => rows.map(simcard => ({
  tipo: simcard.tipo,
  descricao: simcard.descricao,
  quantidade: simcard.quantidade,
  loja: {
    id: simcard.id_loja,
    nome: simcard.nome_loja,
    cnpj: simcard.cnpj_loja
  }
}));

const sp019 = (dbquery, lojas) => ({
  
  listAparelhos: (page, limit, filter = '') => {
    const paramFilter = lojas.map(() => `%${filter}%`);
    return sqlTotalAparelhos(lojas)
      .then(sql => dbquery(sql, paramFilter).then(rows => rows[0]))
      .then(({ total }) => getInitialPoint(page, limit).then(initial => ({ total, initial })))
      .then(({ total, initial }) => sqlAparelhos(lojas, initial, limit).then(sql => ({ total, sql })))
      .then(({ total, sql }) => dbquery(sql, paramFilter).then(rows => ({ total, rows })))
      .then(createAparelhosResponse)
  },

  listSimcards: (filter = '') => {
    return sqlSimcards(lojas)
      .then(sql => dbquery(sql, [`%${filter}%`]).then(createSimcardsResponse))
  },

  resumoGeral: ({ dataInicial, dataFinal }) => {
    return sqlResumoGeral({ lojas, dataInicial, dataFinal })
      .then(sql => dbquery(sql))
  }

});

module.exports = sp019;