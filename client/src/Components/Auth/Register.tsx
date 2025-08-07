import React from "react";
import { Button, Card, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Header from "../Header";
import "../../Css/Register.css"; // ✅ Add your stylesheet
import { useRegister } from "../../Services/RegisterService";
import bcrypt from "bcryptjs";

const { Title, Text } = Typography;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {mutate: registerMutate} = useRegister();

    const onFinish = async (values: any) => {
      // const hashedPassword = bcrypt.hashSync(
      //   values.password,
      //   "$2b$13$jtClg6Qdy2xn7Oer8FH3m."
      // );
      
      try {
          await registerMutate( values);
      } catch (error: any) {
        if (error.response?.status === 409) {
          alert(error.response.data.message || "User already exists.");
        } else {
          console.error("Error:", error);
          alert("Something went wrong during sign up.");
        }
        // form.resetFields();
      }
    };

  return (
    <>
      <Header />
      <div className="register-container">
        <Card
          className="register-card"
          // title={
          //   <div className="register-title">
          //     <LoginOutlined className="register-icon" />
          //     <p className="register-signin-text">Sign In</p>
          //   </div>
          // }
        >
          <div className="d-flex" >
            {/* Left Section - Form */}
            <div style={{width: "500px"}}> 
              <Title
                level={3}
                style={{ color: "#2D1A5B", marginBottom: 0 }}
                // className="d-center"
              >
                {/* <img
                  src="https://cdn-icons-png.flaticon.com/128/295/295128.png"
                  alt="Welcome Icon"
                  style={{ marginRight: 8 }}
                  width={40}
                /> */}
                Welcome to Your Smart Dashboard
              </Title>
              <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                Join a community that grows with you
              </Text>

              <Form
                {...formItemLayout}
                name="register"
                // scrollToFirstError
                  form={form}
                layout="vertical"
                style={{ marginTop: 30 }}
                autoComplete="off"
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    { type: "email", message: "Invalid email!" },
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
                    className="gray"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    className="gray"
                  />
                </Form.Item>

                {/* <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The new password that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Confirm your password"
                    className="gray"
                  />
                </Form.Item> */}

                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name!",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Enter your name"
                    className="gray"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="register-button"
                  >
                    Register
                  </Button>
                </Form.Item>
                <Text type="secondary">
                  Already have an account?
                  <span
                    onClick={() => navigate("/login")}
                    style={{
                      textDecoration: "underline",
                      color: "#2D1A5B",
                      cursor: "pointer",
                    }}
                  >
                    <span className="register-footer-link">Login</span>
                  </span>
                </Text>
              </Form>
            </div>

            {/* Right Section - Image */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}

            >
              <img
                src="loginImg.png"
                alt="Login Illustration"
                style={{ width: "100%", maxWidth: "400px" }}
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Register;
