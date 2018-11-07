module.exports = app => {

  app.get('/acessrios/:page/:limit', (req, res, next) => {
    const { page, limit } = req.params;
    console.log({ page, limit });
  });
};