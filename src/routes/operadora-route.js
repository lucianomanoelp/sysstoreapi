const { createPeriod } = require('../utils/date-utils');
const resumoGeralFacade = require('../facades/resumo-geral-facade');

module.exports = app => {

  app.get('/operadora/resumo/:dataInicial/:dataFinal', (req, res, next) => {
    const { dataInicial, dataFinal } = req.params;
    const period = createPeriod(dataInicial, dataFinal);
    const { sp019, cp012, usu005 } = req.appContext.models;
    return Promise.all([
      sp019.resumoGeral({ dataInicial: period.dataInicial, dataFinal: period.dataFinal }),
      cp012.list(),
      usu005.getPrecoChip()
    ])
    .then(response => {
      const lojasAux = JSON.parse(req.headers.lojas);
      const lojas = response[1].filter(loja => lojasAux.some(l => loja.cnpj === l.cnpj));
      const resumo = resumoGeralFacade(response[0], lojas, response[2].precoChip);
      res.status(200).json(resumo);
    })
  });
};