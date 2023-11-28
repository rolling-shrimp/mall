import { Routes, Route } from "react-router-dom";

import { useState, useCallback, useEffect, createContext } from "react";
import AxiosFun from "./service/AxiosFun";
import Enrolls from "./pages/enroll";
import Login from "./pages/login";
import Header from "./components/header";
import Homepage from "./pages/hompage";
import Cart from "./pages/cart";
import useFectData_aflerLogin from "./hooks/useFectData_aflerLogin";

import "../node_modules/bootstrap/dist/css/bootstrap.css";
export const shareInf = createContext();

function App() {
  const [stuff, setStuff] = useState([]);

  const [toInsert, settoInsert] = useState([]);
  const [toUpdate, settoUpdate] = useState([]);
  const [state, setCart, currentUser, setcurrentUser] =
    useFectData_aflerLogin();
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
    console.log("check if localstorage is empty or not, useEffect");
    const savedCart = JSON.parse(localStorage.getItem("shoppingItem"));
    console.log(savedCart);
    if (savedCart !== null) {
      setCart({ type: "ADD_TO_CART", playload: savedCart });
    }
  }, []);

  return (
    <div className="App">
      <div className="filter"> </div>
      <shareInf.Provider
        value={{
          setCart,
          currentUser,
          setcurrentUser,
          toInsert,
          settoInsert,
          toUpdate,
          settoUpdate,
          state,
        }}
      >
        <Header />
        <Routes>
          <Route
            path="/"
            element={<Homepage stuff={stuff} state={state} setCart={setCart} />}
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
