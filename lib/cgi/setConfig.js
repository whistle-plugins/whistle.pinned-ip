const { trim, updateDnspod } = require('../util');

const ERR_MSG = '系统繁忙，请稍后再试!';

module.exports = async (ctx) => {
  const { localStorage } = ctx.req;
  const { body } = ctx.request;
  const id = trim(body.id);
  const token = trim(body.token);
  const domain = trim(body.domain);
  if (id && token && domain) {
    try {
      const result = await updateDnspod(`${id},${token}`, domain);
      if (result) {
        ctx.body = { ec: 2, msg: result.message || ERR_MSG };
        return;
      }
    } catch (e) {
      ctx.body = { ec: 2, msg: ERR_MSG };
      return;
    }
    localStorage.setProperty('id', id);
    localStorage.setProperty('token', token);
    localStorage.setProperty('domain', domain);
  }
  ctx.body = { ec: 0 };
};
