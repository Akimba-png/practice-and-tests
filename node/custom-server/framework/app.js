const http = require('http');
const Emitter = require('events');


class App {
  constructor() {
    this.server = this.#createServer();
    this.emitter = new Emitter();
    this.middlewares = [];
  }

  #createServer() {
    return http.createServer((req, res) => {
      this.#applyMiddlewares(req, res, () => {
        const emitted = this.emitter.emit(`${[req.pathname]}:${[req.method]}`, req, res);
        if (!emitted) { res.end() }
      });
    });
  }

  async #applyMiddlewares(req, res, onSuccess) {
    await this.middlewares.reduce((acc, middleware) => {
      return acc.then(() => new Promise((resolve) => middleware(req, res, resolve)));
    }, Promise.resolve());
    onSuccess(req, res);
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  addRouter(router) {
    Object.keys(router.endpoint).forEach((path) => {
      const endpoint = router.endpoint[path];
      Object.keys(endpoint).forEach((method) => {
        const handler = endpoint[method];
        this.emitter.on(`${[path]}:${[method]}`, (req, res) => {
          handler(req, res);
        });
      });
    });
  }

  listen(port) {
    this.server.listen(port, () => console.log(`server is listening on ${port}`));
  }
}

module.exports = App;
