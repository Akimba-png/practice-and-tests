// Кастомный сервер
const http = require('http');
const EventEmitter = require('events');


// -- router.js
class Router {
  constructor() {
    this.endpoints = {};
  }

  request(method = 'GET', path, handler) {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {};
    }
    const endpoint = this.endpoints[path];
    if (endpoint[method]) {
      throw new Error(`method ${method} was already implemented`);
    }
    endpoint[method] = handler;
  }

  get(path, handler) {
    this.request('GET', path, handler);
  }

  post(path, handler) {
    this.request('POST', path, handler);
  }

  put(path, handler) {
    this.request('PUT', path, handler);
  }

  delete(path, handler) {
    this.request('DELETE', path, handler);
  }
}


// -- application.js
class Application {
  constructor() {
    this.emitter = new EventEmitter();
    this.server = this.#createServer();
    this.middlewares = [];
  }

  #createServer() {
    return http.createServer((req, res) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        if (body) {
          req.body = JSON.parse(body);
        }
        this.middlewares.forEach((middleware) => middleware(req, res));
        const emitted = this.emitter.emit(this.#getRouteMask(req.pathname, req.method), req, res);
        if (!emitted) {
          res.end();
        }
      });
    })
  }

  #getRouteMask(path, method) {
    return `[${path}]:[${method}]`;
  }

  addRouter(router) {
    const endpoints = router.endpoints;
    Object.keys(endpoints).forEach((path) => {
      const endpoint = endpoints[path];
      Object.keys(endpoint).forEach((method) => {
        const handler = endpoint[method];
        this.emitter.on(this.#getRouteMask(path, method), (req, res) => {
          handler(req, res);
        })
      })
    });
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }
}


// -- middlewares.js
const parseJson = (_req, res) => {
  res.send = (data) => {
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(JSON.stringify(data));
  };
};

const parseUrl = (baseUrl) => (req, res) => {
  const parsedUrl = new URL(req.url, baseUrl);
  req.pathname = parsedUrl.pathname;
  const params = {};
  parsedUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  req.params = params;
};


// -- db.js
const users = [ {id: 1, name: 'Vasya'}, {id: 2, name: 'Misha'} ];


// -- userController.js
class UserController {
  static getUser(req, res) {
    if (req.params.id) {
      const user = users.find((e) => e.id === Number(req.params.id));
      res.send(user);
      return;
    }
    res.send(users);
  }

  static createUser(req, res) {
    const user = req.body;
    users.push(user);
    res.send(user);
  }
}


// -- userRouter.js
const userRouter = new Router();
userRouter.get('/users', UserController.getUser);
userRouter.post('/users', UserController.createUser);


// -- index.js
const app = new Application();
app.addRouter(userRouter);
app.use(parseJson);
app.use(parseUrl('http://localhost:3000'));
app.listen(3000, () => console.log(`server is listeninig on port 3000`));
