const getUserFromDb = (userEmail, totalUsers) => {
  return totalUsers.find((user) => user.email === userEmail);
};

module.exports = { getUserFromDb };
