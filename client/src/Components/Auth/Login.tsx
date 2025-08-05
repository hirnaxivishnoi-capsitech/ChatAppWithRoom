import React, { useEffect } from "react";
import { Button, Form, Input, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Header from "../Header";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const Id = localStorage.getItem("Id");
  const jwtToken = localStorage.getItem("jwtToken");
  const isEmployer = window.location.pathname.includes("employer");
  const [form] = Form.useForm();

  useEffect(() => {
    if (Id && jwtToken) {
      navigate(isEmployer ? "/dashboard" : "/candidate/profile");
    }
  }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Login Failed:", errorInfo);
  };

  return (
    <>
      <Header />
      <div className="d-flex" style={{ justifyContent: "center", marginTop: 30 }}>
        <Card
          style={{
            width: 900,
            padding: 0,
            borderRadius: 12,
            backgroundColor: "#f2f2fd",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {/* Left Section - Form */}
            <div style={{ flex: 1, padding: "40px 32px" }}>
              <Title level={3} style={{ color: "#2D1A5B", marginBottom: 0 }} className="d-center">
                <img  src="https://cdn-icons-png.flaticon.com/128/295/295128.png" className="px-8" width={40}/> Welcome Back
              </Title>
              <Text type="secondary" className="px-8 mt-8" >Login to your Ryzo account</Text>

              <Form
                form={form}
                layout="vertical"
                style={{ marginTop: 30 }}
                autoComplete="off"
                onFinishFailed={onFinishFailed}
                // onFinish={onFinish} 
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Please input your email!" }]}
                >
                  <Input
                    size="large"
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Please input your password!" }]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    style={{
                      backgroundColor: "#2D1A5B",
                      borderColor: "#2D1A5B",
                    }}
                  >
                    Login
                  </Button>
                </Form.Item>

                <Text type="secondary">
                  New to Ryzo?{" "}
                  <span
                    onClick={() => navigate("/register")}
                    style={{
                      textDecoration: "underline",
                      color: "#2D1A5B",
                      cursor: "pointer",
                    }}
                  >
                    Create an account
                  </span>
                </Text>
              </Form>
            </div>

            {/* Right Section - Image */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12,
              }}
            >
              <img
                src="loginImg.png"
                alt="Login Illustration"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Login;
