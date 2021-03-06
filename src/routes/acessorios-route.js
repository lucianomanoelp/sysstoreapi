const { createPaginatedResponse } = require('../utils/paginated-response-utils');

module.exports = app => {

  app.get('/acessorio/:page/:limit/:filter?', (req, res, next) => {    
    const { page, limit, filter } = req.params;
    const { sp002 } = req.appContext.models;
    sp002.list(page, limit, filter)
      .then(({ total, itens }) => {
        const response = createPaginatedResponse(page, limit, total, itens);
        res.status(200).json(response);
      })
      .catch(next);
  });
  
};