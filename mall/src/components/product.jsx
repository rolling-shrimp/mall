import React, { useState, useContext } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { shareInf } from "../App";
const Product = ({ item, state, setCart }) => {
  const [amount, setamount] = useState(0);
  const setdata = useContext(shareInf).setdata;
  const data = useContext(shareInf).data;
  const changeObject = (e) => {
    const { value } = e.target;
    setamount(parseInt(value));
  };
  return (
    <Card className="stuff" style={{ width: "18rem" }} key={item.id}>
      <Card.Body>
        <Card.Title>{item.product_name}</Card.Title>
        <p>價錢: {item.price}</p>
        <label htmlFor={item.id}>數量 </label>
        <Form.Control
          type="number"
          name="amount"
          onChange={changeObject}
          value={amount}
        />

        <Button
          variant="primary"
          onClick={() => {
            if (amount == 0) {
              alert("請選擇數量");
            } else {
              alert("加入車成功");

              const newItem = {
                id: item.id,
                product_name: item.product_name,
                total_price: item.price * amount,
                price: item.price,
                amount: amount,
              };
              setCart({ type: "ADD_TO_CART", playload: [newItem] });
              setdata([...data, newItem]);

              setamount(0);
            }
          }}
        >
          加入購物車
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Product;
