const startOfTheDay = date => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
};

const endOfTheDay = date => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59));
};

const createPeriod = (prDataInicial, prDataFinal) => {
  let dataInicial = prDataInicial.split('-');
  let dataFinal = prDataFinal.split('-');
  dataInicial = new Date(dataInicial[0], dataInicial[1]-1, dataInicial[2]);
  dataFinal = new Date(dataFinal[0], dataFinal[1]-1, dataFinal[2]);     
  return {
     dataInicial: startOfTheDay(dataInicial),
     dataFinal: endOfTheDay(dataFinal)
  };
};

const diferenceBetweenDates = (firstDay, lastDay) => {
  const timeDiference = Math.abs(lastDay.getTime() - firstDay.getTime());
  return Math.ceil(timeDiference / (1000 * 3600 * 24)); 
};

module.exports = { startOfTheDay, endOfTheDay, createPeriod, diferenceBetweenDates };