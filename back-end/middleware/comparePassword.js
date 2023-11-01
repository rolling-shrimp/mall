const bcrypt = require("bcrypt");

// 生成密码哈希
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// 比对密码哈希
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
