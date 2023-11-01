import React from "react";
import { useState, useMemo, useEffect, useCallback, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container, Col, Row, Button } from "react-bootstrap";
import AxiosFun from "../service/AxiosFun";
import Items from "../components/items";

const Cart = ({ state }) => {
  console.log(
    "initializing statistics setting theCart useMemo cart setting theList setthelist new map"
  );

  const [outputdata, setOutputdata] = useState([]);
  const [buyingItems, setBuyingItems] = useState([]);
  const navigate = useNavigate();

  let theCart = useMemo(() => {
    return state;
  }, [state]);

  const handleCheckout = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/會員登入");
      return;
    }
    try {
      let response = await AxiosFun.post(
        "http://localhost:3535/profile/submit",
        theCart
      );
      alert("提交成功");
    } catch (e) {
      console.log(e);
      alert("提交失敗，可能有錯誤產生，請通知客服");
    }
  };

  return (
    <Container>
      {theCart.map((item) => (
        <Items
          key={theCart.indexOf(item)}
          item={item}
          // onUpdate={handleItemUpdate}
          // deleting={deleting}
        />
      ))}
      {theCart.length == 0 && <h1 className="bg-primary w-25">購物車是空的</h1>}
      {theCart.length > 0 && (
        <p>
          {theCart.reduce(
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
