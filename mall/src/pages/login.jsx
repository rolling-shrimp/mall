import React from "react";
import { useState, useContext } from "react";
import { Form, Container, Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AxiosFun from "../service/AxiosFun";
import { shareInf } from "../App";
const Login = () => {
  const [log, setlog] = useState({});
  const navigate = useNavigate();
  const setcurrentUser = useContext(shareInf).setcurrentUser;
  const changeValue = (e) => {
    const { name, value } = e.target;
    setlog({ ...log, [name]: value });
  };
  const submitLog = async () => {
    try {
      let response = await AxiosFun.post(
        "http://localhost:3535/auth/login",
        log
      );

      console.log(response.data);
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setcurrentUser(AxiosFun.getCurrentUser());
      }
      alert("登入成功");
      navigate("/");
    } catch (e) {
      console.log(e);
      alert("登入失敗");
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
            <Button onClick={submitLog}>登入</Button>
          </Form>
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  );
};

export default Login;
