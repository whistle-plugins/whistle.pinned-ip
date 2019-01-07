const { trim, updateDnspod, getLocalAddress } = require('../util');

const MAX_AGE = 1000 * 60 * 5;
let timeout;
let timer;
let localStorage;
let curIp;
let startTime = 0;
let curToken;

const stop = () => {
  clearTimeout(timer);
  clearTimeout(timeout);
  timer = null;
  timeout = null;
};

const update = async (init) => {
  if (init) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = setTimeout(stop, MAX_AGE);
      return;
    }
    timeout = setTimeout(stop, MAX_AGE);
  }
  const domain = trim(localStorage.getProperty('domain'));
  const id = trim(localStorage.getProperty('id'));
  let token = trim(localStorage.getProperty('token'));
  if (id && token && domain) {
    token = `${id},${token}`;
    const localIp = getLocalAddress();
    const now = Date.now();
    // MAX_AGE后不管什么情况都会强制更新
    if (now - startTime > MAX_AGE || curToken !== token || curIp !== localIp) {
      startTime = now;
      const updateDns = async () => {
        const result = await updateDnspod(token, domain);
        if (!result) {
          curToken = token;
          curIp = localIp;
        }
      };
      try {
        await updateDns();
      } catch (e1) {
        try {
          await updateDns();
        } catch (e2) {}
      }
    }
  }
  timer = timeout && setTimeout(update, 5000);
};

module.exports = async (ctx) => {
  localStorage = ctx.req.localStorage;
  await update(true);
};
