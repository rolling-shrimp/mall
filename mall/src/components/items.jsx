import React, { useState, useEffect, useMemo, useContext } from "react";
import { Form, Container, Col, Row, Button } from "react-bootstrap";
import { shareInf } from "../App";
const Items = ({ item }) => {
  const infdata = useContext(shareInf).data;
  const setinfdata = useContext(shareInf).setdata;
  const setCart = useContext(shareInf).setCart;
  let data = useMemo(() => {
    return item;
  }, [item]);
  console.log("item:", item);
  console.log("data:", data);

  return (
    <Row>
      <Col>
        {" "}
        <p>{data.product_name}</p>{" "}
      </Col>
      <Col>
        <label style={{ color: "white" }} htmlFor="">
          {" "}
          總數量:
        </label>
        <Form.Control
          type="number"
          name="amount"
          value={data.amount}
          onChange={(e) => {
            const { name, value } = e.target;

            setCart({
              type: "Update_Cart",
              playload: [
                {
                  id: data.id,
                  product_name: data.product_name,
                  amount: parseInt(value),
                  total_price: parseInt(value) * data.price,
                  price: data.price,
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

        <p> {data.total_price} </p>
      </Col>
      <Col>
        <Button
          onClick={async () => {
            let ordinaryCart = JSON.parse(localStorage.getItem("shoppingItem"));
            ordinaryCart.forEach((element, index) => {
              if (element.id == data.id) {
                ordinaryCart.splice(index, 1);
              }
            });
            if (ordinaryCart.length == 0) {
              localStorage.removeItem("shoppingItem");
            } else {
              localStorage.setItem(
                "shoppingItem",
                JSON.stringify(ordinaryCart)
              );
            }

            let ordDataList = JSON.parse(
              localStorage.getItem("clickingAmount")
            );
            console.log(ordDataList);
            ordDataList = ordDataList.filter((item) => item.id != data.id);
            if (ordDataList.length == 0) {
              localStorage.removeItem("clickingAmount");
            } else {
              localStorage.setItem(
                "clickingAmount",
                JSON.stringify(ordDataList)
              );
            }

            await setinfdata((prev) => {
              return prev.filter((item) => item.id != data.id);
              // if (prev.length == 1) {
              //   return [];
              // } else {
              // }
            });
            setCart({ type: "Delete_Item", playload: { id: data.id } });
          }}
        >
          刪除
        </Button>
      </Col>
    </Row>
  );
};

export default Items;
