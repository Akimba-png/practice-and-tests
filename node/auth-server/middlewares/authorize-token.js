const jwt = require('jsonwebtoken');
let { DbToken } = require('./../db');


const authorizeToken = (req, res, next) => {
  const authToken = req.headers['x-token'];
  if (!authToken || !DbToken.isExist(authToken)) {
    res.status(401).send('user is unauthorized');
    return;
  }
  jwt.verify(authToken, process.env.ACCESS_JWT_TOKEN, (error, encodedData) => {
    if (error) {
      res.status(403).send('token was expired');
      return;
    }
    req.userId = encodedData;
  })
  next();
};

module.exports = { authorizeToken };
