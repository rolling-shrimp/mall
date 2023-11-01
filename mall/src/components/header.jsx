import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { shareInf } from "../App";
import AxiosFun from "../service/AxiosFun";
const arr = ["會員註冊", "會員登入"];

const Header = () => {
  const data = useContext(shareInf).data;
  const setdata = useContext(shareInf).setdata;
  const setCart = useContext(shareInf).setCart;
  const currentUser = useContext(shareInf).currentUser;
  const setcurrentUser = useContext(shareInf).setcurrentUser;
  const handleLogout = () => {
    localStorage.removeItem("user");
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

    setcurrentUser(AxiosFun.getCurrentUser());
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
            {data.length > 0 && <p className="cartptag">{data.length}</p>}
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
