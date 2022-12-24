const users = require('./../db/db').users;

const getUser = (req, res) => {
  if (req.query.id) {
    res.send(users.find((user) => user.id.toString() === req.query.id));
    return;
  }
  res.send(users);
};

const postUser = (req, res) => {
  users.push(req.body);
  res.send(req.body);
};

module.exports = { getUser, postUser };
