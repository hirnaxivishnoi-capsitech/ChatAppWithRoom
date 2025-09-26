// import React from "react";
import {
  Form,
  Typography,
  notification,
  Divider,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { usechangePassword } from "../../Services/changePasswordService";
const { Title,Text } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const changePasswordMutation = usechangePassword();
  const [api, contextHolder] = notification.useNotification();

  const onFinish = (values: any) => {
    changePasswordMutation
      .mutateAsync(values)
      .then((res: any) => {
        if (res?.status) {
          api.success({ message: res?.message });
        } else {
          api.error({ message: res?.message });
        }
      })
      .catch((error: any) => {
        api.error({
          message: error?.response?.data?.message || "Something went wrong",
        });
      })
      .finally(() => {
        form.resetFields();
      });
  };

  return (
    <>
      {contextHolder}
        {/* <Card style={{borderRadius: 12}}> */}
        <div className="text-center mb-6">
            <Title level={3}>🔐 Change Password</Title>
            <Text type="secondary">
              Keep your account secure by updating your password.
            </Text>
          </div>
        <Divider />
        <ProForm
          style={{ padding:'0 10px'}}
          form={form}
          submitter={{
            searchConfig: {
              submitText: "Change Password",
              resetText:"Cancel",
            },
            submitButtonProps: {
              size: "large",
              className: "mx-4",
              block: true,
               style: {
                  width: "30%",
                },
            },
            resetButtonProps: {
              size: "large",
              className: "mx-4",
              block: true,
               style: {
                  width: "30%",
                },
            },
          }}
          onFinish={onFinish}
        >
             <ProFormText
              label="Email Address"
              name="email"
              placeholder="example@domain.com"
              fieldProps={{
                size: "large",
                prefix: <MailOutlined />,
              }}
              rules={[{ required: true, message: "Please enter your email" }]}
            />

            <ProFormText.Password
              name="oldPassword"
              label="Current Password"
              placeholder="Enter current password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined />,
              }}
              rules={[
                { required: true, message: "Please enter your current password" },
              ]}
            />

            <ProFormText.Password
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined />,
              }}
              rules={[
                { required: true, message: "Please enter a new password" },
              ]}
            />

            <ProFormText.Password
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter new password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined />,
              }}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match")
                    );
                  },
                }),
              ]}
            />
          </ProForm>
    {/* </Card> */}
    </>
  );
};

export default ChangePassword;
