const createPaginatedResponse = ( page, limit, total, itens) => {
  const pages = Math.ceil(total / limit);
  return {
    total,
    pageInfo: {
      hasPreviousPage: page > 1,
      hasNextPage: page < pages,
      pages,
      page
    },
    itens
  };
};

const getInitialPoint = (page, limit) => new Promise((resolve) => resolve((page * limit) - limit));

//const getItensPaginated = fnModel => args => fnModel(args).then(createPaginatedResponse(args));

module.exports = { getInitialPoint, createPaginatedResponse };