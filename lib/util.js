const DnspodApi = require('dnspod-api');
const os = require('os');

const DEFAULT_PARAMS = {
  record_line: '默认',
  record_type: 'A',
  status: 'enable',
};

const getLocalAddress = () => {
  const interfaces = os.networkInterfaces();
  const keys = Object.keys(interfaces);
  for (let i = 0, len = keys.length; i < len; i++) {
    const iface = interfaces[keys[i]];
    for (let j = 0, len2 = iface.length; j < len2; j++) {
      const { family, address, internal } = iface[j];
      if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
        return address;
      }
    }
  }
};

const parseDomain = (domain) => {
  const list = domain.toLowerCase().split('.');
  let subDomain = list.slice(0, -2);
  domain = list.slice(-2).join('.');
  if (domain === 'com.cn') {
    if (!subDomain.length) {
      return;
    }
    subDomain = list.slice(0, -3);
    domain = list.slice(-3).join('.');
  }
  subDomain = subDomain.join('.') || '';
  return { domain, sub_domain: subDomain };
};

const updateDnspod = async (token, domain) => {
  const localIp = getLocalAddress();
  const params = localIp && parseDomain(domain);
  if (!params) {
    return;
  }
  const dnspodApi = new DnspodApi({
    server: 'dnspod.cn',
    token,
  });
  let result = await dnspodApi.do({
    action: 'Record.List',
    params: Object.assign({}, params),
  });
  let { status } = result;
  let code = parseInt(status.code, 10);
  if (code !== 1 && code !== 10) {
    return status;
  }
  let record = (result.records || '')[0];
  if (record && record.value === localIp) {
    return;
  }
  Object.assign(params, DEFAULT_PARAMS);
  params.record_id = record && record.id;
  params.value = localIp;
  if (!params.record_id) {
    record = await dnspodApi.do({
      action: 'Record.Create',
      params: Object.assign({}, params),
    });
    status = record.status;
    code = parseInt(status.code, 10);
    if (code !== 1) {
      return status;
    }
    params.record_id = record.id;
  }
  if (!params.record_id) {
    return status;
  }
  result = await dnspodApi.do({
    action: 'Record.Modify',
    params,
  });
  status = result.status;
  code = parseInt(status.code, 10);
  return code === 1 ? null : status;
};

exports.updateDnspod = updateDnspod;
exports.getLocalAddress = getLocalAddress;
exports.trim = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.trim().substring(0, 128);
};
