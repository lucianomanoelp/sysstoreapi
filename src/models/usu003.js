const programas = [  
  'AUT_DESC', //LIBERAR DESCONTO
  'CP002',  // CONTAS A PAGAR
  'SP077', // RESUMO GERAL
  'SP002', // ITENS
  'SP019', // APARELHOS
  'SP019A', // SIMCARDS
  'SP076', // RESUMO DO CAIXA
  'SP059', // RANKING DE VENDAS POR VENDEDOR
  'USU004', // DESBLOQUEAR USUÁRIO
];

const sql = `select bous03prog as prog from USU003 where bous03cod = ? and bous03exe = ?`;

const usu003 = dbquery => ({

  getByIdGrupo: idGrupo => dbquery(sql, [idGrupo, 'S'])
    .then(([rows]) => rows)
    .then(response => response.filter(permissao => programas.some(p => p === permissao.prog)))
  
});

module.exports = usu003;