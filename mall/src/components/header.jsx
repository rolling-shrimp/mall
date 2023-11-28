import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { shareInf } from "../App";
import AxiosFun from "../service/AxiosFun";
const arr = ["會員註冊", "會員登入"];

const Header = () => {
  // const data = useContext(shareInf).data;
  const setdata = useContext(shareInf).setdata;
  const setCart = useContext(shareInf).setCart;
  const currentUser = useContext(shareInf).currentUser;
  const setcurrentUser = useContext(shareInf).setcurrentUser;
  const state = useContext(shareInf).state;
  const handleLogout = async () => {
    let arr = ["shoppingItem", "clickingAmount"];
    arr.forEach((item) => {
      let a = JSON.parse(localStorage.getItem(item));
      if (a) {
        localStorage.removeItem(item);
        if (item === "shoppingItem") {
          setCart({ type: "Update_Cart", playload: [] });
        } else {
          setdata([]);
        }
      }
    });
    setCart({ playload: [] });
    if (state.length !== 0) {
      try {
        let response = await AxiosFun.get_afterLogin(
          `http://localhost:3535/afterLogin/cart/${currentUser.user.id}`,
          {
            headers: {
              Authorization: currentUser.token,
            },
          }
        );

        let databaseCart = response.data;
        let currentCart = state;
        let toInsert = [];
        let toUpdate = [];
        currentCart.forEach((item) => {
          let theSameid = databaseCart.find((stuf) => stuf.id === item.id);
          if (!theSameid) {
            toInsert.push(item);
          } else {
            if (item.amount !== theSameid.amount) {
              toUpdate.push(item);
            }
          }
        });
        //開始更新資料庫
        if (toInsert.length !== 0) {
          let response2 = await AxiosFun.post_afterLogin(
            `http://localhost:3535/afterLogin/add_cart/${currentUser.user.id}`,
            { statistic: toInsert },
            {
              headers: {
                Authorization: currentUser.token,
              },
            }
          );
          console.log(response2);
        }
        if (toUpdate.length !== 0) {
          let response3 = await AxiosFun.update(
            { statistic: toUpdate },

            {
              headers: {
                Authorization: currentUser.token,
              },
            },
            currentUser.user.id
          );
          console.log(response3);
        }
        localStorage.removeItem("user");
        setcurrentUser(AxiosFun.getCurrentUser());
      } catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <header className="d-flex flex-column justify-content-center align-items-center">
      <h1>Mall</h1>
      <nav className="w-100">
        <ul className="d-flex flex-row justify-content-start align-items-center w-100">
          <li>
            <Link className="navli" to={"/"}>
              首頁
            </Link>
          </li>
          <li>
            <Link className="navli" to={"/購物車"}>
              購物車
            </Link>
            {/* {data.length > 0 && <p className="cartptag">{data.length}</p>} */}
          </li>
          {!currentUser &&
            arr.map((item) => (
              <li>
                {" "}
                <Link className="navli" to={`/${item}`}>
                  {item}
                </Link>
              </li>
            ))}

          {currentUser && (
            <li>
              <Link className="navli" to={`/個人頁`}>
                個人頁
              </Link>
            </li>
          )}
          {currentUser && (
            <li>
              <Link onClick={handleLogout} className="navli" to={"/"}>
                登出
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
