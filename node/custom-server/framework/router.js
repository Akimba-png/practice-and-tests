class Router {
  constructor() {
    this.endpoint = {};
  }

  request(method, path, handler) {
    if (!this.endpoint[path]) {
      this.endpoint[path] = {};
    }
    const endpoint = this.endpoint[path];
    if (endpoint[method]) {
      throw new Error('method was already implemented');
    }
    endpoint[method] = handler;
  }

  get(path, handler) {
    this.request('GET', path, handler);
  }

  post(path, handler) {
    this.request('POST', path, handler);
  }
}

module.exports = Router;
