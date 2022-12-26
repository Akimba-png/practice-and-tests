const users = [];
let tokens = [];
let offers = [{id: 1, title: 'title 1'}, {id: 2, title: 'title 2'}];

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

class DbOffer {
  static getAll() {
    return offers;
  }
}
module.exports = { DbUser, DbToken, DbOffer };
