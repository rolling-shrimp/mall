import React, { useState, useRef } from "react";

import { Container, Col, Row, Form, Button, Card } from "react-bootstrap";
import Product from "../components/product";
import { Link } from "react-router-dom";
const Homepage = ({ stuff, state, setCart, setdata }) => {
  return (
    <Container>
      <Row>
        <Col md={2}></Col>
        <Col>
          <Row className="d-flex flex-row align-items-center justify-content-center">
            {stuff.map((item) => (
              <Col
                key={stuff.indexOf(item)}
                className="d-flex flex-row align-items-center justify-content-center "
              >
                <Product
                  key={stuff.indexOf(item)}
                  item={item}
                  state={state}
                  setCart={setCart}
                  setdata={setdata}
                />
              </Col>
            ))}
          </Row>
          <Button>
            <Link to={"/購物車"}>前往購物車</Link>
          </Button>
        </Col>

        <Col md={2}></Col>
      </Row>
    </Container>
  );
};

export default Homepage;
