import React from "react";
import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useReducer,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container, Col, Row, Button } from "react-bootstrap";
import AxiosFun from "../service/AxiosFun";
import Items from "../components/items";
import { shareInf } from "../App";

const Cart = () => {
  console.log(
    "initializing statistics setting theCart useMemo cart setting theList setthelist new map"
  );

  const [outputdata, setOutputdata] = useState([]);
  const [buyingItems, setBuyingItems] = useState([]);
  const state = useContext(shareInf).state;
  const setCart = useContext(shareInf).setCart;
  const navigate = useNavigate();
  const handleDelete = (deleteItem) => {
    console.log("dlete item start");
    let theLocalstorage = JSON.parse(localStorage.getItem("shoppingItem"));
    theLocalstorage.forEach((stuff, index) => {
      if (stuff.id === deleteItem.id) {
        theLocalstorage.splice(index, 1);
        localStorage.setItem("shoppingItem", JSON.stringify(theLocalstorage));
      }
    });
    setCart({
      type: "Delete_Item",
      playload: deleteItem,
    });
  };
  const handleCheckout = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/會員登入");
      return;
    }
    try {
      let response = await AxiosFun.post(
        "http://localhost:3535/profile/submit",
        state
      );
      alert("提交成功");
    } catch (e) {
      console.log(e);
      alert("提交失敗，可能有錯誤產生，請通知客服");
    }
  };

  return (
    <Container>
      {state.map((item) => (
        <Items
          key={state.indexOf(item)}
          item={item}
          handleDelete={handleDelete}
          // onUpdate={handleItemUpdate}
          // deleting={deleting}
        />
      ))}
      {state.length == 0 && <h1 className="bg-primary w-25">購物車是空的</h1>}
      {state.length > 0 && (
        <p>
          {state.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.total_price,
            0
          )}
        </p>
      )}
      <Button onClick={handleCheckout}>提交</Button>
    </Container>
  );
};

export default Cart;
