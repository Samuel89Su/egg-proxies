'use strict';

/**
 * Dependencies
 */
const url = require('url');
const pathMatch = require('path-match');
const HttpProxy = require('./http-proxy');

/**
 * Constants
 */

const proxy = HttpProxy.createProxyServer();
const route = pathMatch({
    // path-to-regexp options
  sensitive: false,
  strict: false,
  end: false,
});

let eventRegistered = false;

/**
 * Koa Http Proxy Middleware
 * @param {*} context
 * @param {*} options
 * @returns {func} func
 */
module.exports = (context, options) => (ctx, next) => {
    // create a match function
  const match = route(context);
  if (!match(ctx.path)) return next();

  let opts = Object.assign({}, options);
  if (typeof options === 'function') {
    const params = match(ctx.path);
    opts = options.call(options, params);
  }

  const {
        logs,
        rewrite,
        events,
    } = opts;

  const httpProxyOpts = Object.keys(opts)
        .filter(n => [ 'logs', 'rewrite', 'events' ].indexOf(n) < 0)
        .reduce((prev, cur) => {
          prev[cur] = opts[cur];
          return prev;
        }, {});

  return new Promise((resolve, reject) => {
    ctx.req.oldPath = ctx.req.url;

    if (typeof rewrite === 'function') {
      ctx.req.url = rewrite(ctx.req.url, ctx);
    }

    if (logs) logger(ctx, opts.target);

    if (events && typeof events === 'object' && !eventRegistered) {
      Object.entries(events).forEach(([ event, handler ]) => {
        proxy.on(event, handler);
      });
      eventRegistered = true;
    }

        // Let the promise be solved correctly after the proxy.web.
        // The solution comes from https://github.com/nodejitsu/node-http-proxy/issues/951#issuecomment-179904134
    ctx.res.on('close', () => {
      reject(new Error(`Http response closed while proxying ${ctx.req.oldPath}`));
    });
    ctx.res.on('finish', () => {
      resolve();
    });

    proxy.web(ctx.req, ctx.res, httpProxyOpts, e => {
      const status = {
        ECONNREFUSED: 503,
        ETIMEOUT: 504,
      }[e.code];
      ctx.status = status || 500;
      resolve();
    });
  });
};

module.exports.proxy = proxy;

function logger(ctx, target) {
  console.log('%s - %s %s proxy to -> %s', new Date().toISOString(), ctx.req.method, ctx.req.oldPath, url.resolve(target, ctx.req.url));
}
