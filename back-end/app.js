const express = require("express");
const authRoute = require("./middleware").auth;
const afterLogin = require("./middleware").afterLogin;
const con = require("./mysqlDB");
const dotenv = require("dotenv");
dotenv.config();
var cors = require("cors");

require("dotenv").config(); // 导入dotenv模块，加载环境变量
const app = express();

const passport = require("passport");
require("./middleware/passport")(passport);

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoute);
app.use(
  "/afterLogin",
  passport.authenticate("jwt", { session: false }),
  afterLogin
);

app.get("/stuff", (req, res) => {
  con.query("select * from beatforsell", (err, row) => {
    if (err) {
      console.error(err);
      res.json(err);
    } else {
      console.log("fetch data success");
      res.json(row);
    }
  });
});

app.listen("3535", () => {
  console.log("port 3535 receiving request");
});
