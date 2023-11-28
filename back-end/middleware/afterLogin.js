const router = require("express").Router();
const connection = require("../mysqlDB");
router.use((req, res, next) => {
  console.log("receiving request after authentication");
  next();
});
router.get("/cart/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "select id, product_name,amount,price,total_price from cart where user_id = ? ",
    [id],
    (err, row) => {
      if (err) {
        console.error(err);
        res.json(err);
      } else {
        res.json(row);
      }
    }
  );
});
router.post("/add_cart/:user_id", (req, res) => {
  console.log("adding sth", req.body);
  const { user_id } = req.params;
  let { statistic } = req.body;

  let thestatistic = statistic.map((item) => [
    parseInt(user_id),
    item.id,
    item.product_name,
    item.amount,
    item.price,
    item.total_price,
  ]);
  connection.query(
    "insert into cart (user_id,id,product_name,amount,price,total_price) values  ? ",
    [thestatistic],
    (err, row) => {
      if (err) {
        console.error(err);
        res.json(err);
      } else {
        res.json(row);
        console.log("inseting data success");
      }
    }
  );
});
// router.put("/update_cart/:user_id", (req, res) => {
//   let { statistic } = req.body;
//   const { user_id } = req.params;

//   statistic.forEach((element) => {
//     let query =
//       "update cart set amount = amount + ?,  where user_id =? and id = ? ; update cart set total_price = total_price + ? where user_id =? and id = ?  ";
//     connection.query(
//       query,
//       [
//         element.amount,
//         user_id,
//         element.id,
//         element.total_price,
//         user_id,
//         element.id,
//       ],
//       (err, row) => {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log("成功更新數據");
//         }
//       }
//     );
//   });
// });
router.put("/update_cart/:user_id", (req, res) => {
  let { statistic } = req.body;
  const { user_id } = req.params;
  console.log("updating", statistic);

  statistic.forEach((element) => {
    // 更新 amount 列
    connection.query(
      "UPDATE cart SET amount =  ? WHERE user_id = ? AND id = ?",
      [element.amount, user_id, element.id],
      (err, row) => {
        if (err) {
          console.error("更新 amount 列时发生错误", err);
        } else {
          console.log("成功更新 amount 列");
        }
      }
    );

    // 更新 total_price 列
    connection.query(
      "UPDATE cart SET total_price = ? WHERE user_id = ? AND id = ?",
      [element.total_price, user_id, element.id],
      (err, row) => {
        if (err) {
          console.error("更新 total_price 列时发生错误", err);
        } else {
          console.log("成功更新 total_price 列");
        }
      }
    );
  });
});

module.exports = router;
