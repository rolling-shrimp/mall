const mySQL = require("mysql");

require("dotenv").config(); // 导入dotenv模块，加载环境变量

var connection = mySQL.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});
connection.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});
module.exports = connection;
