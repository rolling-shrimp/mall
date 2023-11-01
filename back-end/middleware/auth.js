const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const con = require("../mysqlDB");
const jwt = require("jsonwebtoken");
const passwordUtils = require("./comparePassword");

router.use((req, res, next) => {
  console.log("router.use() receiving request");
  next();
});
// const loggingout = (req, res, next) => {
//   req.logout();
//   res.redirect("/");
//   next();
// };
// router.get("/login", (req, res) => {
//   console.log(req.session);
//   res.render("login.ejs");
// });
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
//   res.redirect("/profile");
// });
// router.get("/logout", loggingout, (req, res) => {});

router.post("/signup", (req, res) => {
  const { name, email, phone, account, password } = req.body;
  con.query(
    "select account from account where account = ?",
    [account],
    (ree, row) => {
      console.log(row);
      if (!row.length == 0) {
        res.send("你的帳號名稱已經被使用");
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            console.log(err);

            return res.status(500).send("An error occurred");
          }
          con.query(
            "insert into account(name,email,phone,account,password) values(?,?,?,?,?)",
            [name, email, phone, account, hash],
            (err, row) => {
              if (err) {
                console.error(err);
              }

              console.log(row);
              res.send({
                msg: "註冊成功",
              });
            }
          );
        });
      }
    }
  );
});
router.post("/login", (req, res) => {
  //validation
  // const { error } = login(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  // const { account, password } = req.body;
  //先找出有沒有該帳號，若是沒有，回報沒有該帳號
  const { account, password } = req.body;
  const query = "SELECT * FROM account WHERE account = ?";
  con.query(query, [account], (err, results) => {
    if (err) {
      console.error("Error retrieving user information:", err);
      res.status(500).json({ error: "An error occurred" });
    } else if (results.length === 0) {
      //帳戶沒註冊
      res.status(404).json({ error: "User not found" });
    } else {
      //進行帳密驗證
      const userAccount = results[0];
      // const testPassword = passwordUtils.hashPassword(password);
      const passwordMatched = passwordUtils.comparePassword(
        password,
        userAccount.password
      );
      if (passwordMatched) {
        // 密码匹配，登录成功
        // res.status(200).json({ message: "Login successful" });
        const jtokenObject = {
          id: userAccount.id,
          name: userAccount.name,
          email: userAccount.email,
          phone: userAccount.phone,
          account: userAccount.account,
        };
        const thetoken = jwt.sign(jtokenObject, process.env.SECRET);
        res.send({
          message: `${userAccount.name} 你好，祝您購物愉快 `,
          token: "jwt " + thetoken,
          user: {
            id: userAccount.id,
            name: userAccount.name,
            email: userAccount.email,
            phone: userAccount.phone,
            account: userAccount.account,
          },
        });
      } else {
        // 密码不匹配，登录失败
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  });
});
module.exports = router;
