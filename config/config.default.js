'use strict';

/**
 * egg-proxy default config
 * @member Config#proxies
 * @property {String} SOME_KEY - some description
 */

exports.proxies = {
  context: '/ewtbend',
  target: 'http://web.ewt360.com',
  changeOrigin: true,
  // agent: new httpsProxyAgent('http://1.2.3.4:88'), // if you need or just delete this line
  // rewrite: path => path.replace(/^\/octocat(\/|\/\w+)?$/, '/vagusx'),
  logs: true,
};
