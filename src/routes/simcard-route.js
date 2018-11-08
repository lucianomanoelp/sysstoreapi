module.exports = app => {

  app.get('/simcard/:filter?', (req, res, next) => {
    const { sp019 } = req.appContext.models;
    const { filter } = req.params;
    sp019.listSimcards(filter)
      .then(simcards => res.status(200).json(simcards))
      .catch(next);
  });
};