const { trim } = require('../util');

module.exports = (ctx) => {
  const { localStorage } = ctx.req;
  ctx.body = {
    id: trim(localStorage.getProperty('id')),
    token: trim(localStorage.getProperty('token')),
    domain: trim(localStorage.getProperty('domain')),
  };
};
