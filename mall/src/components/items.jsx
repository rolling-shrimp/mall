import React, { useState, useEffect, useMemo, useContext } from "react";
import { Form, Container, Col, Row, Button } from "react-bootstrap";
import { shareInf } from "../App";
const Items = ({ item, handleDelete }) => {
  const infdata = useContext(shareInf).data;
  const setinfdata = useContext(shareInf).setdata;
  const setCart = useContext(shareInf).setCart;
  // const handleDelete = (deleteItem) => {
  //   console.log("dlete item start");
  //   let theLocalstorage = JSON.parse(localStorage.getItem("shoppingItem"));
  //   theLocalstorage.forEach((stuff, index) => {
  //     if (stuff.id === deleteItem.id) {
  //       theLocalstorage.splice(index, 1);
  //       localStorage.setItem("shoppingItem", JSON.stringify(theLocalstorage));
  //     }
  //   });
  //   setCart({
  //     type: "Delete_Item",
  //     playload: deleteItem,
  //   });
  // };
  let data = useMemo(() => {
    return item;
  }, [item]);
  console.log("item:", item);
  console.log("data:", data);

  return (
    <Row>
      <Col>
        {" "}
        <p>{item.product_name}</p>{" "}
      </Col>
      <Col>
        <label style={{ color: "white" }} htmlFor="">
          {" "}
          總數量:
        </label>
        <Form.Control
          type="number"
          name="amount"
          value={item.amount}
          onChange={(e) => {
            const { name, value } = e.target;

            setCart({
              type: "Update_Cart",
              playload: [
                {
                  id: item.id,
                  product_name: item.product_name,
                  amount: parseInt(value),
                  total_price: parseInt(value) * item.price,
                  price: item.price,
                },
              ],
            });
          }}
        />
      </Col>
      <Col>
        <label style={{ color: "white" }} htmlFor="">
          {" "}
          總價:
        </label>

        <p> {item.total_price} </p>
      </Col>
      <Col>
        <Button
          onClick={() => {
            handleDelete(item);
          }}
        >
          刪除
        </Button>
      </Col>
    </Row>
  );
};

export default Items;
