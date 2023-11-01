const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const connection = require("../mysqlDB");

module.exports = (passport) => {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: process.env.SECRET,
  };

  passport.use(
    new JwtStrategy(jwtOptions, (jwtPayload, done) => {
      // 在这里验证 JWT 中的用户信息
      // 示例中假设已经验证通过，并将用户信息作为 jwtPayload 返回
      const userID = jwtPayload.id;
      const query = "SELECT * FROM `account` WHERE id= ?";
      connection.query(query, [userID], (error, results) => {
        if (error) {
          return done(error, false); // 查询出错，传递错误给 done 回调函数
        }

        if (results.length === 0) {
          return done(null, false); // 未找到用户，传递验证失败给 done 回调函数
        }

        const user = results[0];
        return done(null, user); // 验证成功，将用户信息传递给 done 回调函数
      });
    })
  );
};
