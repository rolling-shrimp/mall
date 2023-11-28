export const fetchData = async () => {
  if (currentUser) {
    console.log(currentUser.token);
    try {
      let response = await AxiosFun.get_afterLogin(
        `http://localhost:3535/afterLogin/cart/${currentUser.user.id}`,
        {
          headers: {
            Authorization: currentUser.token,
          },
        }
      );
      console.log("get the data from database when login");
      console.log(response.data);

      if (response.data.length === 0) {
        //使用者第一次來訪，第一次添加購物車，第一次登入，購物車資料庫沒有該使用者的資料
        console.log(state);
        if (state.length !== 0) {
          let dataToserver = { statistic: state };
          let response = await AxiosFun.post_afterLogin(
            `http://localhost:3535/afterLogin/add_cart/${currentUser.user.id}`,
            dataToserver,
            {
              headers: {
                Authorization: currentUser.token,
              },
            }
          );
          console.log("the first time add data", response.data);
        }
      } else {
        if (state.length === 0) {
          //使用者之前登入時有加入購物車，這次來訪並沒有添加購物車的狀況之下登入
          //如果購物車震的length為0不用更新
          console.log(
            "the user did not click anything to add cart bofore logging in ",
            state
          );

          setCart({ type: "ADD_TO_CART", playload: response.data });
        } else {
          //使用者之前登入時有加入購物車，這次來訪"有添加購物車"的狀況之下登入
          //需要更改資料庫，更改state,再更改資料庫

          //整合完帶入setCart
          console.log("the user has add cart before login", state);
          const databaseCart = response.data;
          const currentCart = state;
          let toUpdate = [];
          let toInsert = [];

          //如果資料庫沒有state的資料，代表使用者除了這次，之前未點選過此商品需要新增
          currentCart.forEach((item) => {
            if (!databaseCart.find((stu) => stu.id === item.id)) {
              toInsert.push(item);
            }
          });

          //如果資料庫有state的資料，代表資料需要合併數量價錢要相加
          //如果資料庫有的資料state沒有，代表該資料使用者上次點選的商品要加到這次的前端購物車
          databaseCart.forEach((databaseItem) => {
            const existingItem = currentCart.find(
              (item) => item.id === databaseItem.id
            );
            if (existingItem) {
              // 如果商品在当前购物车中已存在，你可以选择合并数量、更新价格等
              // 更新 currentCart 中的商品信息
              existingItem.amount += databaseItem.amount;
              existingItem.total_price += databaseItem.total_price;
              toUpdate.push(existingItem);
            } else {
              // 如果商品在当前购物车中不存在，将其添加到 currentCart
              currentCart.push(databaseItem);
            }
          });

          console.log("toupdate:", toUpdate);
          console.log("toInsert", toInsert);
          // 最后，将整合后的购物车数据设置为应用的新状态
          // setCart({ type: "SET_CART", payload: currentCart });

          //更新資料庫

          if (toInsert.length !== 0) {
            const infToserver = { statistic: toInsert };
            let response2 = await AxiosFun.post_afterLogin(
              `http://localhost:3535/afterLogin/add_cart/${currentUser.user.id}`,
              infToserver,
              {
                headers: {
                  Authorization: currentUser.token,
                },
              }
            );
            console.log("add the summerized to database", response2.data);
          }
          if (toUpdate.length !== 0) {
            const infToserver2 = { statistic: toUpdate };
            let response3 = await AxiosFun.update(
              infToserver2,
              {
                headers: {
                  Authorization: currentUser.token,
                },
              },
              currentUser.user.id
            );
            console.log(
              "update the database by the newItem which combined with the former data",
              response3.data
            );
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log("have not login ");
  }
};
