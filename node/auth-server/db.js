const users = [];
let tokens = [];

class DbToken {
  static add(tokenToUpdate) {
    tokens.push(tokenToUpdate);
  }

  static remove(tokenToUpdate) {
    tokens = tokens.filter((token) => token !== tokenToUpdate);
  }

  static isExist(token) {
    return tokens.includes(token);
  }
}

class DbUser {
   static isExist(userEmail) {
    return !!users.find((user) => user.email === userEmail);
  }

  static add(user) {
    users.push(user);
  }

  static getOne(userEmail) {
    return users.find((user) => user.email === userEmail);
  }
}
module.exports = { DbUser, DbToken };

