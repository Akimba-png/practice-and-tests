const jsonParser = (_req, res, next) => {
  res.send = (data) => {
    res.writeHead(200, 'Content-type: application/json');
    res.end(JSON.stringify(data));
  };
  next();
};

const bodyParser = (req, _res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    if (body) {
      req.body = JSON.parse(body);
    }
    next();
  });
};


const parseUrl = (baseUrl) => (req, _res, next) => {
  const parsedUrl = new URL(`${baseUrl}${req.url}`);
  req.pathname = parsedUrl.pathname;
  const query = {};
  parsedUrl.searchParams.forEach((value, key) => query[key] = value);
  req.query = query;
  next();
};

module.exports = { jsonParser, bodyParser, parseUrl };
