import { Routes, Route } from "react-router-dom";

import {
  useState,
  useCallback,
  useEffect,
  useReducer,
  createContext,
} from "react";
import AxiosFun from "./service/AxiosFun";
import Enrolls from "./pages/enroll";
import Login from "./pages/login";
import Header from "./components/header";
import Homepage from "./pages/hompage";
import Cart from "./pages/cart";

import "../node_modules/bootstrap/dist/css/bootstrap.css";
export const shareInf = createContext();
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItem = action.playload;
      console.log(newItem);
      // const findSameID = state.find((item) => item.id == newItem.id);
      // if (findSameID) {
      //   findSameID.amount += newItem.amount;
      //   findSameID.price += newItem.price;
      // } else {
      //   state.push(newItem);
      // }
      if (newItem.find((sth) => state.some((it) => it.id === sth.id))) {
        const updatedCart = state.map((item) => {
          let theSame = newItem.find((stuffs) => item.id === stuffs.id);
          if (theSame) {
            return {
              ...item,
              amount: item.amount + theSame.amount,
              total_price: item.total_price + theSame.total_price,
            };
          }

          return item;
        });

        return updatedCart;
      } else {
        return [...state, ...newItem];
      }

    case "Update_Cart":
      const used_forUpdate = action.playload;
      console.log(used_forUpdate);
      const update = state.map((item) => {
        let theSame = used_forUpdate.find((stuffs) => item.id === stuffs.id);
        if (theSame) {
          return theSame;
        }
        return item;
      });
      console.log(update);
      return update;
    case "Delete_Item":
      const stuff_toDelete = action.playload;
      console.log(stuff_toDelete);
      let afterDelete = state.filter((item) => item.id !== stuff_toDelete.id);
      console.log(afterDelete);
      return afterDelete;

    default:
      return state;
  }
};
function App() {
  const [stuff, setStuff] = useState([]);
  const [state, setCart] = useReducer(cartReducer, []);
  const [data, setdata] = useState([]);
  const [currentUser, setcurrentUser] = useState(AxiosFun.getCurrentUser());
  const [userCart, setuserCart] = useState([]);
  const fetchh = useCallback(() => {
    const takeStuff = async () => {
      try {
        let response = await AxiosFun.get("http://localhost:3535/stuff");
        setStuff(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    takeStuff();
  }, []);
  useEffect(() => {
    fetchh();
  }, [fetchh]);

  useEffect(() => {
    console.log("saving data to localstorage the shoppingitem, useEffect");
    console.log(state.length);
    if (state.length !== 0) {
      localStorage.setItem("shoppingItem", JSON.stringify(state));
    }
  }, [state]);
  useEffect(() => {
    console.log("saving data to localstorage the clikingAmount, useEffect");
    console.log(data.length);
    if (data.length !== 0) {
      localStorage.setItem("clickingAmount", JSON.stringify(data));
    }
  }, [data]);
  useEffect(() => {
    console.log("check if localstorage is empty or not, useEffect");
    const savedCart = JSON.parse(localStorage.getItem("shoppingItem"));
    console.log(savedCart);

    const savedData = JSON.parse(localStorage.getItem("clickingAmount"));
    if (savedCart !== null) {
      setCart({ type: "ADD_TO_CART", playload: savedCart });
    }
    if (savedData !== null) {
      setdata(savedData);
    }
  }, []);
  const currentUser_Change = useCallback(() => {
    const fetchData_afterLogin = async () => {
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
          } else {
            if (state.length === 0 && data.length === 0) {
              //使用者之前登入時有加入購物車，這次來訪並沒有添加購物車的狀況之下登入

              setCart({ type: "ADD_TO_CART", playload: response.data });
              setdata(response.data);
            } else {
              //使用者之前登入時有加入購物車，這次來訪"有添加購物車"的狀況之下登入
              //需要更改資料庫，更改state,再更改資料庫

              //整合完帶入setCart
              const databaseCart = response.data;
              const currentCart = state;

              databaseCart.forEach((databaseItem) => {
                const existingItem = currentCart.find(
                  (item) => item.id === databaseItem.id
                );
                if (existingItem) {
                  // 如果商品在当前购物车中已存在，你可以选择合并数量、更新价格等
                  // 更新 currentCart 中的商品信息
                  existingItem.amount += databaseItem.amount;
                  existingItem.total_price += databaseItem.total_price;
                } else {
                  // 如果商品在当前购物车中不存在，将其添加到 currentCart
                  currentCart.push(databaseItem);
                }
              });

              //比對構成傳到後端更新資料庫的物件
              let toUpdate = currentCart.filter((item) => {
                if (databaseCart.some((stuf) => stuf.id === item.id)) {
                  return item;
                }
              });
              let toInsert = currentCart.filter((item) => {
                if (databaseCart.some((stuf) => stuf.id !== item.id)) {
                  return item;
                }
              });
              console.log("toupdate:", toUpdate);
              console.log("toInsert", toInsert);
              // 最后，将整合后的购物车数据设置为应用的新状态
              setCart({ type: "SET_CART", payload: currentCart });

              //更新資料庫
              const infToserver = { statistic: toInsert };
              const infToserver2 = { statistic: toUpdate };

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
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log("have not login ");
      }
    };
    fetchData_afterLogin();
  }, [currentUser]);
  useEffect(() => {
    console.log("useEffect, check currentuser is null or not");
    currentUser_Change();
  }, [currentUser_Change]);

  return (
    <div className="App">
      <div className="filter"> </div>
      <shareInf.Provider
        value={{ setdata, data, setCart, currentUser, setcurrentUser }}
      >
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <Homepage
                stuff={stuff}
                state={state}
                setCart={setCart}
                setdata={setdata}
              />
            }
          ></Route>
          <Route path="/購物車" element={<Cart state={state} />}></Route>
          <Route path="/會員登入" element={<Login />}></Route>
        </Routes>
      </shareInf.Provider>

      <Routes>
        <Route path="/會員註冊" element={<Enrolls />}></Route>
      </Routes>
    </div>
  );
}

export default App;
