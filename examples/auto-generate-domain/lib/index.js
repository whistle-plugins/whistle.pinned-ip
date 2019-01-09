const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const router = require('koa-router')();
const setupRouter = require('./router');

const MAX_AGE = 1000 * 60 * 5;

exports.uiServer = (server, { storage, config: { port } }) => {
  const app = new Koa();
  app.proxy = true;
  setupRouter(router, storage, port);
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(serve(path.join(__dirname, '../public'), MAX_AGE));
  server.on('request', app.callback());
};
