const DnspodApi = require('dnspod-api');
const { hostname, networkInterfaces } = require('os');
// DNSPod里面的id,token
const TOKEN = '12345,ab234234243dc234234d234234';
// DNSPod里面的添加的域名
const DOMAIN = 'xxx.cn';

exports.DOMAIN = DOMAIN;

const DEFAULT_PARAMS = {
  record_line: '默认',
  record_type: 'A',
  status: 'enable',
};

const getLocalAddress = () => {
  const interfaces = networkInterfaces();
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

const getSubDomain = (storage) => {
  let subDomain = storage.getProperty('subDomain');
  if (!/^[a-z]{1,20}\d\d$/.test(subDomain)) {
    subDomain = hostname();
    subDomain = typeof subDomain === 'string' ? subDomain.toLowerCase().trim() : '';
    if (/^([a-z]{1,20})/.test(subDomain)) {
      subDomain = RegExp.$1;
    } else {
      subDomain = `${Math.floor(Math.random() * 100000000)}`.substring(0, 6);
    }
    let random = `${Math.floor(Math.random() * 100000000)}`.substring(0, 2);
    if (random === '38') {
      random = '00';
    } else if (random.length < 2) {
      random = `0${random}`;
    }
    subDomain = `${subDomain}${random}`;
    storage.setProperty('subDomain', subDomain);
  }
  return subDomain;
};

exports.getSubDomain = getSubDomain;

const updateDnspod = async (subDomain) => {
  const localIp = getLocalAddress();
  const dnspodApi = new DnspodApi({
    server: 'dnspod.cn',
    token: TOKEN,
  });
  const params = {
    domain: DOMAIN,
    sub_domain: subDomain,
  };
  let result = await dnspodApi.do({
    action: 'Record.List',
    params: Object.assign({}, params),
  });
  let { status } = result;
  const code = parseInt(status.code, 10);
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
    if (parseInt(status.code, 10) === 1) {
      return;
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
  return parseInt(status.code, 10) === 1 ? null : status;
};

exports.updateDnspod = updateDnspod;
exports.getLocalAddress = getLocalAddress;
