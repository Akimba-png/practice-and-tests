const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { users } = require('./../../db');
const { getUserFromDb } = require('./../../util.js');

class AuthController {
  static async addNewUser(req, res) {
    try {
      if (getUserFromDb(req.body.email, users)) {
        res.status(400).send('user is already exist');
        return;
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = {
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      };
      users.push(user);
      res.status(201).send('success');
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async authenticateUser(req, res) {
    const requestedData = {
      email: req.body.email,
      password: req.body.password,
    };

    const dbData = getUserFromDb(requestedData.email, users);
    if (!dbData) {
      res.status(404).send('user not found');
      return;
    }

    try {
      const isPasswordCorrect = await bcrypt.compare(requestedData.password, dbData.password);
      if (isPasswordCorrect) {
        const token = jwt.sign(dbData.id, process.env.ACCESS_JWT_TOKEN);
        const responseData = {
          id: dbData.id,
          name: dbData.name,
          email: dbData.email,
          token,
        };
        res.status(200).send(responseData);
        return;
      }
      res.status(400).send('incorrect password');
    }
    catch (error) {
      res.status(500).send(error);
    }
  }

  static checkAuthentication(req, res) {
    res.send(req.userId);
    return;
  }
}

module.exports = AuthController;
