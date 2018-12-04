const { 
  logicaAtivacoes, 
  logicaServicos, 
  logicaClaroTvAvulso, 
  logicaMultiNET, 
  logicaMultiClaro, 
  logicaEmbratel, 
  logicaRebate 
} = require('./logica-resumo-geral');
const dateHelper = require('../utils/date-utils');
const stringHelper = require('../utils/string-helpers');

const resumoGeralFacade = (itens, lojas, precoChip) => {
  
  const indicesLojas = criaIndicesLojas(lojas);
  
  const ativacoes = criaAtivacoes();
  const servicos = criaServicos();
  const claroAvulsos = criaClaroAvulsos();
  const multiNets = criaMultiNETs();
  const multiClaros = criaMultiClaros();
  const embratel = criaEmbratel();
  const rebates = criaRebates();
  const comissoesMargens = criaComissoesMargens(lojas);

  itens.forEach(item => {
    adicionaAtivacao(ativacoes, item, comissoesMargens, indicesLojas);
    adicionaServico(servicos, item, comissoesMargens, indicesLojas);
    adicionaDebitoAutomatico(servicos, item, comissoesMargens, indicesLojas);
    adicionaSolicitacaoPortabilidade(servicos, item, comissoesMargens, indicesLojas);
    adicionaClaroAvulso(claroAvulsos, item, comissoesMargens, indicesLojas);
    adicionaMultiNETs(multiNets, item, comissoesMargens, indicesLojas);
    adicionaMultiClaros(multiClaros, item, comissoesMargens, indicesLojas);
    adicionaEmbratel(embratel, item, comissoesMargens, indicesLojas);    
    adicionaRebates(rebates, item, comissoesMargens, indicesLojas, precoChip);    
  });

  return {
    comissoesMargensLojas: comissoesMargens,
    resultados: [
      ativacoes,
      servicos,
      claroAvulsos,
      multiNets,
      multiClaros,
      embratel,
      rebates,
    ]
  };
};

module.exports = resumoGeralFacade;

const indicesAtivacoes = {
  pre: 0,
  pos: 1,
  controle: 2,
  bandalarga: 3,
  dependente: 4,
  dependentebandalarga: 5,
  total: 6
};

const criaAtivacoes = () => ({  
  chave: 'ativacoes',
  titulo: 'Ativação',
  itens: [
    { descricao: 'Pré', quantidade: 0, valor: 0 },
    { descricao: 'Pós', quantidade: 0, valor: 0 },
    { descricao: 'Controle', quantidade: 0, valor: 0 },
    { descricao: 'Banda Larga', quantidade: 0, valor: 0 },
    { descricao: 'Dependente', quantidade: 0, valor: 0 },
    { descricao: 'Dep. Banda Larga', quantidade: 0, valor: 0 },
    { descricao: 'Total', quantidade: 0, valor: 0 }
  ]
});

const indicesServicos = {
  trocaAparelhoPre: 0,
  trocaAparelhoPos: 1,
  upgradePlano: 2,
  migracaoControle: 3,
  migracaoPos: 4,
  migracaoBandaLarga: 5,
  trocaSimcard: 6,
  inclusaoDependente: 7,
  inclusaoDebitoAut: 8,
  pacotes: 9,
  trocaTitularidadePos: 10,
  trocaMSISDN: 11,
  trocaArea: 12,
  contaOnline: 13,
  solicitacaoPortabilidade: 14,
  noitesEmClaro: 15,
  passaporteAmericas: 16,
  passaporteEuropa: 17,
  total: 18
};

const criaServicos = () => ({  
  chave: 'servicos',
  titulo: 'Serviço',
  itens: [
    { descricao: 'Troca Aparelho Pré', quantidade: 0, valor: 0 },
    { descricao: 'Troca Aparelho Pós', quantidade: 0, valor: 0 },
    { descricao: 'Upgrade de Plano', quantidade: 0, valor: 0 },
    { descricao: 'Migração Controle', quantidade: 0, valor: 0 },
    { descricao: 'Migração Pós', quantidade: 0, valor: 0 },
    { descricao: 'Migração Banda Larga', quantidade: 0, valor: 0 },
    { descricao: 'Troca de Simcard', quantidade: 0, valor: 0 },
    { descricao: 'Inclusão Dependente', quantidade: 0, valor: 0 },
    { descricao: 'Débito Automático', quantidade: 0, valor: 0 },
    { descricao: 'Pacotes', quantidade: 0, valor: 0 },
    { descricao: 'Troca Tit. Pós', quantidade: 0, valor: 0 },
    { descricao: 'Troca de MSISDN', quantidade: 0, valor: 0 },
    { descricao: 'Troca de área', quantidade: 0, valor: 0 },
    { descricao: 'Conta 100% Online', quantidade: 0, valor: 0 },
    { descricao: 'Sol. de Portabilidade', quantidade: 0, valor: 0 },
    { descricao: 'Noites em Claro', quantidade: 0, valor: 0 },
    { descricao: 'Passaporte Américas', quantidade: 0, valor: 0 },
    { descricao: 'Passaporte Europa', quantidade: 0, valor: 0 },
    { descricao: 'Total', quantidade: 0, valor: 0 },
  ]
});

const indicesClaroAvulso = {
  claroTV: 0,
  pacotesAdicionais: 1
};

const criaClaroAvulsos = () => ({
  chave: 'claro_tv_avulso',
  titulo: 'Claro TV Avulso',
  itens: [
    { descricao: 'Claro TV', quantidade: 0, valor: 0 },
    { descricao: 'Pacotes Adicionais', quantidade: 0, valor: 0 },
  ]
});

const indicesMultiNET = {
  pos: 0,
  netTV: 1,
  netVirtua: 2,
  netFone: 3,
  migracaoControle: 4,
  migracaoPos: 5,
  migracaoBandaLarga: 6,
  migracaoParaCombo: 7,
  controle: 8,
  upgradePlano: 9,
  dependente: 10,
  dependentebandalarga: 11,
  trocaAparelho: 12,
  total: 13
};

const criaMultiNETs = () => ({  
  chave: 'multi_net',
  titulo: 'Multi NET',
  itens: [
    { descricao: 'Pós', quantidade: 0, valor: 0 },
    { descricao: 'Net TV', quantidade: 0, valor: 0 },
    { descricao: 'Net Virtua', quantidade: 0, valor: 0 },
    { descricao: 'Net Fone', quantidade: 0, valor: 0 },
    { descricao: 'Migração Controle', quantidade: 0, valor: 0 },
    { descricao: 'Migração Pós', quantidade: 0, valor: 0 },
    { descricao: 'Migração Banda Larga', quantidade: 0, valor: 0 },
    { descricao: 'Migração p/ Combo', quantidade: 0, valor: 0 },
    { descricao: 'Controle', quantidade: 0, valor: 0 },
    { descricao: 'Upgrade de plano', quantidade: 0, valor: 0 },
    { descricao: 'Dependente', quantidade: 0, valor: 0 },
    { descricao: 'Dependente Banda Larga', quantidade: 0, valor: 0 },
    { descricao: 'Troca de Aparelho', quantidade: 0, valor: 0 },
    { descricao: 'Total', quantidade: 0, valor: 0 },
  ]
});

const indicesMultiClaro = {
  pos: 0,
  migracaoControle: 1,
  migracaoPos: 2,
  migracaoBandaLarga: 3,
  trocaAparelho: 4,
  controle: 5,
  upgradePlano: 6,
  dependente: 7,
  dependentebandalarga: 8,
  fone: 9,
  foneAparelho: 10,
  claroTV: 11,
  internet: 12,
  total: 13
};

const criaMultiClaros = () => ({  
  chave: 'multi_claro',
  titulo: 'Multi Claro',
  itens: [
    { descricao: 'Pós', quantidade: 0, valor: 0 },
    { descricao: 'Migração Controle', quantidade: 0, valor: 0 },
    { descricao: 'Migração Pós', quantidade: 0, valor: 0 },
    { descricao: 'Migração Banda Larga', quantidade: 0, valor: 0 },
    { descricao: 'Troca de Aparelho', quantidade: 0, valor: 0 },
    { descricao: 'Controle', quantidade: 0, valor: 0 },
    { descricao: 'Upgrade de Plano', quantidade: 0, valor: 0 },
    { descricao: 'Dependente', quantidade: 0, valor: 0 },
    { descricao: 'Dependente Banda Larga', quantidade: 0, valor: 0 },
    { descricao: 'Fone', quantidade: 0, valor: 0 },
    { descricao: 'Fone Aparelho', quantidade: 0, valor: 0 },
    { descricao: 'Claro TV', quantidade: 0, valor: 0 },
    { descricao: 'Internet', quantidade: 0, valor: 0 },
    { descricao: 'Total', quantidade: 0, valor: 0 },
  ]
});

const indicesEmbratel = {
  claroFone: 0,
  claroFoneAparelho: 1,
  foneFixo: 2,
  total: 3
};

const criaEmbratel = () => ({  
  chave: 'embratel',
  titulo: 'Embratel',
  itens: [
    { descricao: 'Claro Fone', quantidade: 0, valor: 0 },
    { descricao: 'Claro Fone Aparelho', quantidade: 0, valor: 0 },
    { descricao: 'Fone Fixo', quantidade: 0, valor: 0 },
    { descricao: 'Total', quantidade: 0, valor: 0 },
  ]
});

const indicesRebate = {
  pre: 0,
  pos: 1,
  bandalarga: 2,
  total: 3
};

const criaRebates = () => ({  
  chave: 'rebates',
  titulo: 'Rebate',
  itens: [
    { descricao: 'Pré', quantidade: 0, valor: 0 },
    { descricao: 'Pós', quantidade: 0, valor: 0 },
    { descricao: 'Banda Larga', quantidade: 0, valor: 0 },
    { descricao: 'Total', quantidade: 0, valor: 0 },
  ]
});

const criaComissoesMargens = lojas => {
  
  const lojasAux = lojas.map(l => ({
    loja: {
      id: l.id,
      nome: stringHelper.capitalize(l.nome),
      cnpj: l.cnpj
    },
    comissao: 0,
    margem: 0
  }));

  lojasAux.push({
    loja: {
      id: 0,
      nome: 'Total',
      cnpj: '00000000000000'
    },
    comissao: 0,
    margem: 0
  });

  return lojasAux;
};

const criaIndicesLojas = lojas => {

  const lojasMap = new Map();
  lojas.forEach((loja, index) => lojasMap.set(loja.cnpj, index));
  
  lojasMap.set('00000000000000', lojas.length);

  return lojasMap;
};

const retornaIndiceAtivacao = item => {
  if (logicaAtivacoes.ehPre(item))
     return indicesAtivacoes.pre;

  if (logicaAtivacoes.ehPos(item))
     return indicesAtivacoes.pos;

  if (logicaAtivacoes.ehControle(item)) 
     return indicesAtivacoes.controle;

  if (logicaAtivacoes.ehBandaLarga(item)) 
     return indicesAtivacoes.bandalarga;

  if (logicaAtivacoes.ehDependente(item)) 
     return indicesAtivacoes.dependente;

  if (logicaAtivacoes.ehDependenteBandaLarga(item)) 
     return indicesAtivacoes.dependentebandalarga;

  return -1;
};

const adicionaAtivacao = (ativacoes, item, comissoesMargens, indicesLojas) => {  
  const indice = retornaIndiceAtivacao(item);    
  if (indice > -1) {
    const valorComiss = item.bosp37stac && item.bosp37stac.indexOf('CANC') > -1 ? 0 : item.bosp19comis;
    ativacoes.itens[indice].quantidade += 1;
    ativacoes.itens[indice].valor += valorComiss;
    
    ativacoes.itens[indicesAtivacoes.total].quantidade += 1;
    ativacoes.itens[indicesAtivacoes.total].valor += valorComiss;
    adicionaComissao(comissoesMargens, indicesLojas, item, valorComiss);    
  }
};

const adicionaComissao = (comissoesMargens, indicesLojas, item, valor) => {
  comissoesMargens[indicesLojas.get(item.bosp19lcnpj)].comissao += valor;
  comissoesMargens[indicesLojas.get('00000000000000')].comissao += valor;
};

const retornaIndiceValorServico = item => {
  if (logicaServicos.ehTrocaAparelhoPre(item))
    return { indice: indicesServicos.trocaAparelhoPre, valor: item.bosp19comis };
  
  if (logicaServicos.ehTrocaAparelhoPos(item))
    return { indice: indicesServicos.trocaAparelhoPos, valor: item.bosp19comis };

  if (logicaServicos.ehUpgradePlano(item))
    return { indice: indicesServicos.upgradePlano, valor: item.bosp19comis };

  if (logicaServicos.ehMigracaoControle(item))
    return { indice: indicesServicos.migracaoControle, valor: item.bosp19comis };

  if (logicaServicos.ehMigracaoPos(item))
    return { indice: indicesServicos.migracaoPos, valor: item.bosp19comis };    

  if (logicaServicos.ehMigracaoBandaLarga(item))
    return { indice: indicesServicos.migracaoBandaLarga, valor: item.bosp19comis };        

  if (logicaServicos.ehTrocaSimcard(item))
    return { indice: indicesServicos.trocaSimcard, valor: item.bosp19comis };

  if (logicaServicos.ehInclusaoDependente(item))
    return { indice: indicesServicos.inclusaoDependente, valor: item.bosp19comis };  

  if (logicaServicos.ehPacote(item))
    return { indice: indicesServicos.pacotes, valor: item.bosp19txcart };

  if (logicaServicos.ehTrocaTitularidadePos(item))
    return { indice: indicesServicos.trocaTitularidadePos, valor: item.bosp19comis };

  if (logicaServicos.ehTrocaMSISDN(item))
    return { indice: indicesServicos.trocaMSISDN, valor: item.bosp19comis };

  if (logicaServicos.ehTrocaArea(item))
    return { indice: indicesServicos.trocaArea, valor: item.bosp19comis };

  if (logicaServicos.ehContaOnline(item))
    return { indice: indicesServicos.contaOnline, valor: item.bosp19comis };

  if (logicaServicos.ehNoitesEmClaro(item))
    return { indice: indicesServicos.noitesEmClaro, valor: item.bosp19comis };

  if (logicaServicos.ehPassaporteAmericas(item))
    return { indice: indicesServicos.passaporteAmericas, valor: item.bosp19comis };
  
  if (logicaServicos.ehPassaporteEuropa(item))
    return { indice: indicesServicos.passaporteEuropa, valor: item.bosp19comis };
  
  return { indice: -1, valor: 0 };
};

const adicionaServico = (servicos, item, comissoesMargens, indicesLojas) => {
  const {indice, valor } = retornaIndiceValorServico(item);  
  if (indice > -1) {
    servicos.itens[indice].quantidade += 1;
    servicos.itens[indice].valor += valor;

    servicos.itens[indicesServicos.total].quantidade += 1;
    servicos.itens[indicesServicos.total].valor += valor;  
    
    adicionaComissao(comissoesMargens, indicesLojas, item, valor);
  }    
};

const adicionaDebitoAutomatico = (servicos, item, comissoesMargens, indicesLojas) => {
  if (logicaServicos.ehInclusaoDebAut(item)) {
    const indice = indicesServicos.inclusaoDebitoAut;
    const valor = item.bosp19vldeb;

    servicos.itens[indice].quantidade += 1;
    servicos.itens[indice].valor += valor;
    
    servicos.itens[indicesServicos.total].quantidade += 1;
    servicos.itens[indicesServicos.total].valor += valor;
    
    adicionaComissao(comissoesMargens, indicesLojas, item, valor);    
  }  
};

const adicionaSolicitacaoPortabilidade = (servicos, item, comissoesMargens, indicesLojas) => {
  if (logicaServicos.ehSolicitacaoPortabilidade(item)) {
    const indice = indicesServicos.solicitacaoPortabilidade;
    const valor = item.bosp19vlprice;

    servicos.itens[indice].quantidade += 1;
    servicos.itens[indice].valor += valor;
    
    servicos.itens[indicesServicos.total].quantidade += 1;
    servicos.itens[indicesServicos.total].valor += valor;
    
    adicionaComissao(comissoesMargens, indicesLojas, item, valor);    
  }
};

const retornaIndiceClaroAvulso = item => {
  if (logicaClaroTvAvulso.ehClaroTV(item))
    return indicesClaroAvulso.claroTV;

  if (logicaClaroTvAvulso.ehPacotesAdicionais(item))
    return indicesClaroAvulso.pacotesAdicionais;

  return -1;
};

const adicionaClaroAvulso = (claroAvulsos, item, comissoesMargens, indicesLojas) => {  
  const indice = retornaIndiceClaroAvulso(item);
  if (indice > -1) {
    claroAvulsos.itens[indice].quantidade += 1;
    claroAvulsos.itens[indice].valor += item.bosp19vlbonus;

    adicionaComissao(comissoesMargens, indicesLojas, item, item.bosp19vlbonus);        
  }  
};

const retornaIndiceMultiNET = item => {
  if (logicaMultiNET.ehPos(item))
    return indicesMultiNET.pos;

  if (logicaMultiNET.ehNetTV(item))
    return indicesMultiNET.netTV;

  if (logicaMultiNET.ehNetVirtua(item))
    return indicesMultiNET.netVirtua;
  
  if (logicaMultiNET.ehNetFone(item))
    return indicesMultiNET.netFone;

  if (logicaMultiNET.ehMigracaoControle(item))
    return indicesMultiNET.migracaoControle;

  if (logicaMultiNET.ehMigracaoPos(item))
    return indicesMultiNET.migracaoPos;

  if (logicaMultiNET.ehMigracaoBandaLarga(item))
    return indicesMultiNET.migracaoBandaLarga;

  if (logicaMultiNET.ehMigracaoCombo(item))
    return indicesMultiNET.migracaoParaCombo;

  if (logicaMultiNET.ehControle(item))
    return indicesMultiNET.controle;

  if (logicaMultiNET.ehUpgradePlano(item))
    return indicesMultiNET.upgradePlano;    

  if (logicaMultiNET.ehDependente(item))
    return indicesMultiNET.dependente;

  if (logicaMultiNET.ehDependenteBandaLarga(item))
    return indicesMultiNET.dependentebandalarga;

  if (logicaMultiNET.ehTrocaAparelho(item))
    return indicesMultiNET.trocaAparelho;

  return -1;
};

const adicionaMultiNETs = (multiNets, item, comissoesMargens, indicesLojas) => {  
  const indice = retornaIndiceMultiNET(item);
  if (indice > -1) {
    multiNets.itens[indice].quantidade += 1;
    multiNets.itens[indice].valor += item.bosp19comis;

    multiNets.itens[indicesMultiNET.total].quantidade += 1;
    multiNets.itens[indicesMultiNET.total].valor += item.bosp19comis;

    adicionaComissao(comissoesMargens, indicesLojas, item, item.bosp19comis);    
  }
};

const retornaIndiceMultiClaro = item => {
  if (logicaMultiClaro.ehPos(item))
    return { indice: indicesMultiClaro.pos, valor: item.bosp19comis };

  if (logicaMultiClaro.ehMigracaoControle(item))
    return { indice: indicesMultiClaro.migracaoControle, valor: item.bosp19comis };

  if (logicaMultiClaro.ehMigracaoPos(item))
    return { indice: indicesMultiClaro.migracaoPos, valor: item.bosp19comis };        

  if (logicaMultiClaro.ehMigracaoBandaLarga(item))
    return { indice: indicesMultiClaro.migracaoBandaLarga, valor: item.bosp19comis };    

  if (logicaMultiClaro.ehTrocaAparelho(item))
    return { indice: indicesMultiClaro.trocaAparelho, valor: item.bosp19comis };    

  if (logicaMultiClaro.ehControle(item))
    return { indice: indicesMultiClaro.controle, valor: item.bosp19comis };

  if (logicaMultiClaro.ehUpgradePlano(item))
    return { indice: indicesMultiClaro.upgradePlano, valor: item.bosp19comis };

  if (logicaMultiClaro.ehDependente(item))
    return { indice: indicesMultiClaro.dependente, valor: item.bosp19comis };

  if (logicaMultiClaro.ehDependenteBandaLarga(item))
    return { indice: indicesMultiClaro.dependentebandalarga, valor: item.bosp19comis };    

  if (logicaMultiClaro.ehFone(item))
    return { indice: indicesMultiClaro.fone, valor: item.bosp19comis };

  if (logicaMultiClaro.ehFoneAparelho(item))
    return { indice: indicesMultiClaro.foneAparelho, valor: item.bosp19vlbonus };    

  if (logicaMultiClaro.ehClaroTV(item))
    return { indice: indicesMultiClaro.claroTV, valor: item.bosp19vlbonus };    

  if (logicaMultiClaro.ehInternet(item))
    return { indice: indicesMultiClaro.internet, valor: item.bosp19comis };    

  return { indice: -1, valor: 0 };
};

const adicionaMultiClaros = (multiClaros, item, comissoesMargens, indicesLojas) => {
  const { indice, valor } = retornaIndiceMultiClaro(item);
  if (indice > -1) {
    multiClaros.itens[indice].quantidade += 1;
    multiClaros.itens[indice].valor += valor;

    multiClaros.itens[indicesMultiClaro.total].quantidade += 1;
    multiClaros.itens[indicesMultiClaro.total].valor += valor;

    adicionaComissao(comissoesMargens, indicesLojas, item, valor);    
  }
};

const retornaIndiceEmbratel = item => {
  if (logicaEmbratel.ehClaroFone(item))
    return indicesEmbratel.claroFone;

  if (logicaEmbratel.ehClaroFoneAparelho(item))
    return indicesEmbratel.claroFoneAparelho;

  if (logicaEmbratel.ehFoneFixo(item))
    return indicesEmbratel.foneFixo;

  return -1;
};

const adicionaEmbratel = (embratel, item, comissoesMargens, indicesLojas) => {
  const indice = retornaIndiceEmbratel(item);
  if (indice > -1) {
    embratel.itens[indice].quantidade += 1;
    embratel.itens[indice].valor += item.bosp19vlbonus;

    embratel.itens[indicesEmbratel.total].quantidade += 1;
    embratel.itens[indicesEmbratel.total].valor += item.bosp19vlbonus;

    adicionaComissao(comissoesMargens, indicesLojas, item, item.bosp19vlbonus);    
  }
};

const retornaIndiceRebate = item => {
  if (logicaRebate.ehPre(item))
    return indicesRebate.pre;

  if (logicaRebate.ehPos(item))
    return indicesRebate.pos;

  if (logicaRebate.ehBandaLarga(item))
    return indicesRebate.bandalarga;
    
  return -1;
};

const adicionaRebates = (rebates, item, comissoesMargens, indicesLojas, precoChip) => {
  const indice = retornaIndiceRebate(item);
  if (indice > -1) {
    rebates.itens[indice].quantidade += 1;
    rebates.itens[indice].valor += item.bosp19rebate;

    rebates.itens[indicesRebate.total].quantidade += 1;
    rebates.itens[indicesRebate.total].valor += item.bosp19rebate;

    let valorMargem = 0;
            
    if (item.bosp19tec === 'E')
       valorMargem = item.bosp19venda * 0.25;
    else
       valorMargem = (item.bosp19venda - precoChip) * 0.25;

    if (valorMargem < 25)
       valorMargem = 25;       

    if (dateHelper.diferenceBetweenDates(item.bosp19data_venda, item.bosp19data_compra) > 300)
       valorMargem = 0;

    comissoesMargens[indicesLojas.get(item.bosp19lcnpj)].margem += valorMargem;
    comissoesMargens[indicesLojas.get('00000000000000')].margem += valorMargem;
  }
};