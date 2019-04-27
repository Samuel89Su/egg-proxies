'use strict';

const PROXIES = Symbol('Application#PROXIES');
const ProxyContext = require('../../lib/context');

module.exports = {
  get proxy() {
    if (!this[PROXIES]) {
      this[PROXIES] = new ProxyContext(this);
    }
    return this[PROXIES];
  },
};
