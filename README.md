# egg-proxies

proxy plugin for egg.js base on koa-proxies [koa-proxies](https://github.com/vagusX/koa-proxies)


## Usage

```js
// {app_root}/config/plugin.js
exports.proxies = {
  enable: true,
  package: 'egg-proxies',
};
```

## Configuration
Single:

```js
// {app_root}/config/config.default.js
exports.proxies = {
  context: '/user',
  target: 'http://127.0.0.1',
  changeOrigin: true,
};
```

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/Samuel89Su/egg-proxies/issues).

## License

[MIT](LICENSE)
