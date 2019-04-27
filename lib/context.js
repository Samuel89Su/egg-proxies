'use strict';

module.exports = app => {
  exports.config = app.config.proxies;

  return exports;
};
