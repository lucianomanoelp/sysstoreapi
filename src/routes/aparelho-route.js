const { createPaginatedResponse } = require('../utils/paginated-response-utils');

module.exports = app => {

  app.get('/aparelho/:page/:limit/:filter?', (req, res, next) => {
    const { page, limit, filter } = req.params;
    const { sp019 } = req.appContext.models;
    sp019.listAparelhos(page, limit, filter)
      .then(({ total, itens }) => {
        const response = createPaginatedResponse(page, limit, total, itens);
        res.status(200).json(response);
      })
      .catch(next);
  })
};