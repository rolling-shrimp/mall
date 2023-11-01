import React from "react";
import { useState } from "react";
import { Form, Container, Col, Row, Button } from "react-bootstrap";
import AxiosFun from "../service/AxiosFun";

const Enroll = () => {
  const [enroll, setEnroll] = useState({});
  const changeValue = (e) => {
    const { value, name } = e.target;
    setEnroll({ ...enroll, [name]: value });
  };
  const submitEnroll = async () => {
    try {
      let response = await AxiosFun.post(
        "http://localhost:3535/auth/signup",
        enroll
      );

      alert("新增成功");
      console.log(response.data);
    } catch (e) {
      console.log(e);
      alert("發生錯誤");
    }
  };
  return (
    <Container>
      <Row>
        <Col md={3}></Col>
        <Col md>
          <Form>
            <Form.Group>
              <Form.Control
                placeholder="姓名"
                name="name"
                onChange={changeValue}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="email"
                placeholder="email"
                name="email"
                onChange={changeValue}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                placeholder="電話"
                name="phone"
                onChange={changeValue}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                placeholder="帳號"
                name="account"
                onChange={changeValue}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="password"
                placeholder="密碼"
                name="password"
                onChange={changeValue}
              />
            </Form.Group>
            <Button onClick={submitEnroll}>註冊</Button>
          </Form>
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  );
};

export default Enroll;
