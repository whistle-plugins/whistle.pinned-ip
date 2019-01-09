const { updateDnspod, getLocalAddress, DOMAIN, getSubDomain } = require('./util');

let curIp;
let domain;
let subDomain;
let retryCount = 0;

module.exports = (router, storage, port) => {
  subDomain = getSubDomain(storage);
  domain = `${subDomain}.${DOMAIN}`;
  (async function update() {
    const localIp = getLocalAddress();
    if (localIp && curIp !== localIp) {
      ++retryCount;
      const updateDns = async () => {
        await updateDnspod(subDomain);
        curIp = localIp;
        retryCount = 0;
      };
      try {
        await updateDns();
      } catch (e1) {
        try {
          await updateDns();
        } catch (e2) {}
      }
      if (retryCount > 3) {
        curIp = localIp;
      }
    } else {
      retryCount = 0;
    }
    setTimeout(update, 5000);
  }());
  router.get('/cgi-bin/get-settings', (ctx) => {
    ctx.body = {
      host: domain,
      port,
    };
  });
};
