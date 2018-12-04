const logicaAtivacoes = {  
  ehAtivacao(item) {
    return item.bosp19comis >= 0 && item.bosp14plano_ant != 11111 && item.bosp19promoc != 99999 && 
      (item.bosp26ativa === 'S' || item.bosp26ativa === 'C' || item.bosp26ativa === 'I' && (item.bosp26sta === 'S' || item.bosp26sta === 'C'))
  },
  ehPre(item) {
    return(!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaAtivacoes.ehAtivacao(item) && item.bosp20tipo === 'P')
  },
  ehPos(item) {
    return(!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaAtivacoes.ehAtivacao(item) && item.bosp20tipo === 'O')
  },
  ehControle(item) {
    return(!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaAtivacoes.ehAtivacao(item) && (item.bosp20tipo === '2' || item.bosp20tipo === 'D'))
  },
  ehBandaLarga(item) {
    return(logicaAtivacoes.ehAtivacao(item) && item.bosp20tipo === '3')
  },  
  ehDependente(item) {
    return !logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaAtivacoes.ehAtivacao(item) && (item.bosp20tipo === '1' || item.bosp20tipo === 'C')
  },
  ehDependenteBandaLarga(item) {
    return(!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaAtivacoes.ehAtivacao(item) && item.bosp20tipo === '4')
  }
};

const logicaServicos = {
  ehServico(item) {
    return (item.bosp14plano_ant !== 11111 && item.bosp19promoc !== 99999 && item.bosp26ativa === 'N')
  },
  ehTrocaAparelhoPre(item) {
    return (!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaServicos.ehServico(item) 
      && item.bosp19comis > 0 
      && (item.bosp19tec === 'R' || item.bosp19tec === 'E' || item.bosp19tec === 'F') 
      && item.bosp20tipo === 'P')
  },
  ehTrocaAparelhoPos(item) {
    return (!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaServicos.ehServico(item) 
      && item.bosp19comis > 0 
      && (item.bosp19tec === 'R' || item.bosp19tec === 'E' || item.bosp19tec === 'F') 
      && (item.bosp20tipo === 'O' || item.bosp20tipo === '2' || item.bosp20tipo === '1' ||
          item.bosp20tipo === 'D' || item.bosp20tipo === '4' || item.bosp20tipo === '3'))
  },
  ehUpgradePlano(item) {
    return (!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaServicos.ehServico(item) 
      && item.bosp19comis > 0 
      && (item.bosp26interno === 'W' || item.bosp26interno === 'N' || item.bosp26interno === 'O' ||
          item.bosp26interno === 'P' || item.bosp26interno === '4' || item.bosp26interno === 'V' ||
          item.bosp26interno === 'U' || item.bosp26interno === 'Y' || item.bosp26interno === 'Y1' ||
          item.bosp26interno === 'Ð'))
  },
  ehMigracaoControle(item) {
    return (!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) 
      && item.bosp14plano_ant !== 11111 && item.bosp19promoc !== 99999
      && item.bosp19comis > 0 
      && (item.bosp26interno === '^' || item.bosp26interno === '@' || item.bosp26interno === '8' ||
          item.bosp26interno === 'Q' || item.bosp26interno === '1') 
      && (item.bosp20tipo === '2' || item.bosp20tipo === 'D' || item.bosp20tipo === 'C'))
  },
  ehMigracaoPos(item) {
    return (!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item)
      && item.bosp14plano_ant !== 11111 && item.bosp19promoc !== 99999
      && item.bosp19comis > 0 
      && (item.bosp26interno === '^' || item.bosp26interno === '@' || item.bosp26interno === '8' ||
          item.bosp26interno === 'Q' || item.bosp26interno === '1') 
      && ((item.bosp20tipo === 'O' || item.bosp20tipo === '1') && item.bosp19tec.length === 1))
  },
  ehMigracaoBandaLarga(item) {
    return (!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item)
      && item.bosp14plano_ant !== 11111 && item.bosp19promoc !== 99999
      && item.bosp19comis > 0 
      && (item.bosp26interno === '^' || item.bosp26interno === '@' || item.bosp26interno === '8' ||
          item.bosp26interno === 'Q' || item.bosp26interno === '1') 
      && (item.bosp20tipo === '3' && item.bosp19tec.length === 1))
  },
  ehTrocaSimcard(item) {
    return (logicaServicos.ehServico(item) && item.bosp19comis > 0 && (item.bosp19tec === '5' || item.bosp19tec === '5+'))
  },
  ehInclusaoDependente(item) {
    return (!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaServicos.ehServico(item)
      && item.bosp19comis > 0
      && (item.bosp19tec === 'G' || item.bosp19tec === 'G1' || item.bosp19tec === '¹' || item.bosp19tec === '²' || item.bosp19tec === "'"))
  },
  ehInclusaoDebAut(item) {
    return item.bosp14plano_ant !== 11111 && item.bosp19promoc !== 99999 && item.bosp19deb === 'S'
  },
  ehPacote(item) {
    return (!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaServicos.ehServico(item) && item.bosp19comis <= 0 && item.bosp19txcart > 0)
  },
  ehTrocaTitularidadePos(item) {
    return (!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaServicos.ehServico(item) && item.bosp19comis > 0 && item.bosp19tec === 'A')
  },
  ehTrocaMSISDN(item) {
    return (!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaServicos.ehServico(item) && item.bosp19comis > 0 && item.bosp19tec === 'T')
  },
  ehTrocaArea(item) {
    return (!logicaMultiClaro.ehMultiClaro(item) && !logicaMultiNET.ehMultiNET(item) && logicaServicos.ehServico(item) && item.bosp19comis > 0 && item.bosp19tec === 'B')
  },
  ehContaOnline(item) {
    return (logicaServicos.ehServico(item) && item.bosp19comis > 0 && item.bosp19tec === '¢')
  },
  ehSolicitacaoPortabilidade(item) {
    return (item.bosp14plano_ant !== 11111 && item.bosp19promoc !== 99999 && item.bosp19vlprice > 0 && item.bosp26interno === ':')
  },
  ehNoitesEmClaro(item) {
    return (logicaServicos.ehServico(item) && item.bosp19comis > 0 && item.bosp19tec === 'P1')
  },
  ehPassaporteAmericas(item) {
    return (logicaServicos.ehServico(item) && item.bosp19comis > 0 && item.bosp19tec === 'P2')
  },
  ehPassaporteEuropa(item) {
    return (logicaServicos.ehServico(item) && item.bosp19comis > 0 && item.bosp19tec === 'P3')
  }
};

const logicaClaroTvAvulso = {
  ehClaroTV(item) {
    return (item.bosp20tipo === '5' && item.bosp19tec === '©'  && item.bosp20claro.toUpperCase() !== 'EMB098' && !item.bosp19combo.length)
  },
  ehPacotesAdicionais(item) {
    return (item.bosp20tipo === '5' && item.bosp19tec === '©1')
  }
};

const logicaMultiNET = {
  ehMultiNET(item) {        
    return (item.bosp19combo === 'N' || (item.bosp19tec.length === 2 && item.bosp19tec.substr(0,1) === 'N'))
  },
  ehPos(item) {
    return (logicaMultiNET.ehMultiNET(item) && item.bosp20tipo === 'O' && (item.bosp26ativa === 'S' || item.bosp26ativa === 'C'))
  },
  ehControle(item) {
    return (item.bosp19tec === 'N6' || item.bosp19tec === 'N7' || item.bosp19tec === 'N8' || item.bosp19tec === 'N9' 
        || (logicaMultiNET.ehMultiNET(item) && (item.bosp26ativa === 'S' || item.bosp26ativa === 'C')))
      && (item.bosp20tipo === '2' || item.bosp20tipo === 'D' || item.bosp20tipo === 'C')
  },
  ehNetTV(item) {    
    return (item.bosp20tipo === '8' && item.bosp19tec === 'N1')
  },
  ehNetVirtua(item) {    
    return (item.bosp20tipo === 'A' && item.bosp19tec === 'N2')
  },
  ehNetFone(item) {    
    return (item.bosp20tipo === '9' && item.bosp19tec === 'N3')
  },
  ehMigracaoCombo(item) {    
    return (item.bosp19tec === 'N0')
  },
  ehUpgradePlano(item) {    
    return (logicaMultiNET.ehMultiNET(item) 
      && (item.bosp26interno === 'W' || item.bosp26interno === 'N' || item.bosp26interno === 'O' ||
          item.bosp26interno === 'P' || item.bosp26interno === '4' || item.bosp26interno === 'V' ||
          item.bosp26interno === 'U' || item.bosp26interno === 'Y' || item.bosp26interno === 'Y1' ||
          item.bosp26interno === 'Ð'))
  },
  ehDependente(item) {
    return (logicaMultiNET.ehMultiNET(item) 
      && (item.bosp26ativa === 'S' || item.bosp26ativa === 'C') 
      && (item.bosp20tipo === '1' || item.bosp20tipo === 'C'))
  },
  ehDependenteBandaLarga(item) {
    return (logicaMultiNET.ehMultiNET(item) 
      && (item.bosp26ativa === 'S' || item.bosp26ativa === 'C')
      && item.bosp20tipo === '4')
  },
  ehTrocaAparelho(item) {   
    return ((item.bosp19tec === 'N5' || item.bosp19tec === 'NE') 
      || (logicaMultiNET.ehMultiNET(item)
          && (item.bosp20tipo === 'O' || item.bosp20tipo === '2' || item.bosp20tipo === '1' ||      
              item.bosp20tipo === 'D' || item.bosp20tipo === '4' || item.bosp20tipo === '3') 
          && (item.bosp19tec === 'R' || item.bosp19tec === 'E'|| item.bosp19tec === 'F')))
  },
  ehMigracaoControle(item) {   
    return (((item.bosp19tec.substr(0, 2) === 'N4' || (logicaMultiNET.ehMultiNET(item) && (item.bosp19tec === '1' || item.bosp19tec == '8'))) && item.bosp19comis > 0)
      && (item.bosp20tipo === '2' || item.bosp20tipo === 'D' || item.bosp20tipo === 'C'))
  },
  ehMigracaoPos(item) {
    return (item.bosp19tec.substr(0, 2) === 'N4' || (logicaMultiNET.ehMultiNET(item) && (item.bosp19tec === '1' || item.bosp19tec === '8')))
      && item.bosp19comis > 0
      && (item.bosp20tipo === 'O' || item.bosp20tipo === '1');
  },
  ehMigracaoBandaLarga(item) {   
    return (((item.bosp19tec.substr(0, 2) === 'N4' || (logicaMultiNET.ehMultiNET(item) && (item.bosp19tec === '1' || item.bosp19tec == '8'))) && item.bosp19comis > 0)
      && (item.bosp20tipo === '3'))
  }
};

const logicaMultiClaro = {
  ehMultiClaro(item) {
    return (item.bosp19combo === 'C' || (item.bosp19tec.length === 2 && item.bosp19tec.substr(0,1) === 'C'))
  },
  ehPos(item) {
    return (logicaMultiClaro.ehMultiClaro(item) && item.bosp20tipo === 'O' && (item.bosp26ativa === 'S' || item.bosp26ativa === 'C'))
  },
  ehControle(item) {
    return (((item.bosp19tec === 'C2' || item.bosp19tec === 'C3' || item.bosp19tec === 'C4' || item.bosp19tec === 'C5')
      || (logicaMultiClaro.ehMultiClaro(item) && (item.bosp26ativa === 'S' || item.bosp26ativa === 'C')))
    && (item.bosp20tipo === '2' || item.bosp20tipo === 'D' || item.bosp20tipo === 'C'))
  },
  ehMigracaoPos(item) {
    return ((item.bosp19tec.substr(0, 2) === 'C6' || (logicaMultiClaro.ehMultiClaro(item) && (item.bosp19tec === '1' || item.bosp19tec === '8')))
      && item.bosp20tipo === 'O')
  },
  ehMigracaoBandaLarga(item) {
    return ((item.bosp19tec.substr(0, 2) === 'C6' || (logicaMultiClaro.ehMultiClaro(item) && (item.bosp19tec === '1' || item.bosp19tec === '8')))
      && item.bosp20tipo === '3')
  },
  ehMigracaoControle(item) {
    return ((item.bosp19tec.substr(0, 2) === 'C6' || (logicaMultiClaro.ehMultiClaro(item) && (item.bosp19tec === '1' || item.bosp19tec === '8'))) 
    && item.bosp20tipo === '2')
  },
  ehTrocaAparelho(item) {
    return ((item.bosp19tec === 'C8' || item.bosp19tec === 'CE') 
      || (logicaMultiClaro.ehMultiClaro(item) 
          && (item.bosp20tipo === 'O' || item.bosp20tipo === '2' || item.bosp20tipo === '1' || item.bosp20tipo === 'D' || item.bosp20tipo === '4' || item.bosp20tipo === '3') 
          && (item.bosp19tec === 'R' || item.bosp19tec === 'E' || item.bosp19tec === 'F')))
  },
  ehFone(item) {
    return item.bosp19comis > 0 && (item.bosp19tec === 'C7' || item.bosp19tec === 'µ') && (item.bosp20tipo === '6' || item.bosp19combo.substr(0,1) === 'C');
  },
  ehFoneAparelho(item) {
    return item.bosp19vlbonus > 0 && item.bosp19tec === 'C9' && item.bosp20tipo === '6' && item.bosp19combo.substr(0,1) === 'C';
  },
  ehClaroTV(item) {
    return (item.bosp19tec === '©' && item.bosp20tipo === '5' && item.bosp19combo.substr(0,1) === 'C')
  },
  ehInternet(item) {
    return (item.bosp19tec === 'C1' && item.bosp20tipo === '7')
  },
  ehUpgradePlano(item) {
    return (logicaMultiClaro.ehMultiClaro(item)
      && (item.bosp26interno === 'W' || item.bosp26interno === 'N' || item.bosp26interno === 'O' ||
          item.bosp26interno === 'P' || item.bosp26interno === '4' || item.bosp26interno === 'V' ||
          item.bosp26interno === 'U' || item.bosp26interno === 'Y' || item.bosp26interno === 'Y1' ||
          item.bosp26interno === 'Ð'))
  },
  ehDependente(item) {
    return (logicaMultiClaro.ehMultiClaro(item) && (item.bosp20tipo === '1' || item.bosp20tipo === 'C'))
  },
  ehDependenteBandaLarga(item) {
    return (logicaMultiClaro.ehMultiClaro(item) && item.bosp20tipo === '4')
  }
};

const logicaEmbratel = {
  ehClaroFone(item) {
    return item.bosp19vlbonus > 0 && (item.bosp19tec === 'C7' || item.bosp19tec === 'µ') && item.bosp20tipo === '6' && !item.bosp19combo.length
  },
  ehClaroFoneAparelho(item) {
    return item.bosp19vlbonus > 0 && item.bosp19tec === 'C9' && item.bosp20tipo === '6' && !item.bosp19combo.length;
  },
  ehFoneFixo(item) {
    return item.bosp19vlbonus > 0 && (item.bosp19tec === '¿' || item.bosp19tec === '§') && item.bosp20tipo === '6'
  },
};

const logicaRebate = {
  ehRebate(item) {
    return (item.bosp19nota_venda !== 44444 && item.bosp14plano_ant !== 11111 && item.bosp19promoc !== 99999 &&
      item.bosp19nota >  0 && item.bosp19item !== 6000 &&
      item.bosp19tec !== '¿' && item.bosp19tec !== '®' && item.bosp19tec !== '§' &&
      item.bosp19tec !== '¬' && item.bosp19tec !== '¤' && item.bosp19tec !== 'C9' &&
      item.bosp19tec !== '"' && item.bosp19sta.substr(1, 1) !== 'N' && item.bosp14imei_lc === 'L')
  },
  ehPre(item) {
    return (logicaRebate.ehRebate(item) && item.bosp19plano === 1)
  },
  ehBandaLarga(item) {
    return (logicaRebate.ehRebate(item) 
      && (item.bosp20claro.substr(0, 3) === 'P3G' || item.bosp20claro.substr(0, 3) === 'PIN' || item.bosp20claro.substr(0, 3) === 'CIN'))
  },
  ehPos(item) {
    return (logicaRebate.ehRebate(item) && !logicaRebate.ehPre(item) && !logicaRebate.ehBandaLarga(item))
  },
};

module.exports = {
  logicaAtivacoes,
  logicaServicos,
  logicaClaroTvAvulso,
  logicaMultiNET,
  logicaMultiClaro,
  logicaEmbratel,
  logicaRebate
};