const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { DbUser, DbToken } = require('./../../db');


class AuthController {
  static async addNewUser(req, res) {
    try {
      if (DbUser.isExist(req.body.email)) {
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
      DbUser.add(user);
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

    const dbUser = DbUser.getOne(requestedData.email);
    if (!dbUser) {
      res.status(404).send('user not found');
      return;
    }

    try {
      const isPasswordCorrect = await bcrypt.compare(requestedData.password, dbUser.password);
      if (isPasswordCorrect) {
        const token = jwt.sign(dbUser.id, process.env.ACCESS_JWT_TOKEN);
        const responseData = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          token,
        };
        DbToken.add(token);
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

  static unAuthorize(req, res) {
    DbToken.remove(req.headers['x-token']);
    res.status(200).send('user is now unauthorized');
  }
}

module.exports = AuthController;
