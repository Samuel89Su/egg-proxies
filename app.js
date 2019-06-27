'use strict';

// const proxy = require('koa-proxies');
const proxy = require('./lib/proxies');

module.exports = app => {
  let proxyConfs = app.config.proxies || [];
  if (!Array.isArray(proxyConfs)) {
    proxyConfs = [].concat(proxyConfs);
  }

  proxyConfs.forEach(config => {
    const context = config.context;
    delete config.context;
    app.use(proxy(context, config));
  });
};
