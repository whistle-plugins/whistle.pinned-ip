const getConfig = require('./cgi/getConfig');
const setConfig = require('./cgi/setConfig');
const updateDns = require('./cgi/updateDns');

module.exports = (router) => {
  router.get('/cgi-bin/get-config', getConfig);
  router.post('/cgi-bin/set-config', setConfig);
  router.get('/cgi-bin/update-dns', updateDns);
};
