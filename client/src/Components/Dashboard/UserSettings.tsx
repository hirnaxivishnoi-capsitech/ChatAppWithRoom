import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Form,
  Input,
  Typography,
  Button,
  Avatar,
  Badge,
  Modal,
  Divider,
} from "antd";
import {
  UserOutlined,
  BellOutlined,
  LockOutlined,
  BgColorsOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "../../Css/UserSettings.css";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const UserSettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const userDetail = useSelector(userData);
  const showModal = () => setOpen(true);
  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  useEffect(() => {
    if (userDetail) {
      form.setFieldsValue({
        displayName: userDetail.name,
        email: userDetail.email,
        // status: userDetail?.status || "",
      });
    }
  }, []);

  return (
    <div>
      <SettingOutlined
        className="text-center mt-12 fs-16"
        onClick={showModal}
      />
      <Modal
        open={open}
        title={
          <>
            User Settings <Divider />
          </>
        }
        onCancel={handleCancel}
        // onOk={handleSubmit}
        cancelText="Cancel"
        confirmLoading={loading}
        centered
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                handleCancel();
              }, 1000);
            }}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Layout className="user-settings-layout">
          <Sider className="settings-sider" width={220}>
            <Menu mode="inline" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1" icon={<UserOutlined />}>
                Profile
              </Menu.Item>
              <Menu.Item key="2" icon={<BellOutlined />}>
                Notifications
              </Menu.Item>
              <Menu.Item key="3" icon={<LockOutlined />}>
                Privacy
              </Menu.Item>
              <Menu.Item key="4" icon={<BgColorsOutlined />}>
                Appearance
              </Menu.Item>
              <Menu.Item key="5" icon={<LogoutOutlined />} danger>
                Sign Out
              </Menu.Item>
            </Menu>
          </Sider>

          <Layout>
            <Content className="settings-content">
              <div className="profile-header">
                <Badge dot status="success" offset={[-1, 46]}>
                  <Avatar size={64} style={{ backgroundColor: "#7265e6" }}>
                    {userDetail?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
                <div className="user-info">
                  <Title level={4}>{userDetail?.name}</Title>
                  <Text type="secondary">{userDetail?.email}</Text>
                  <Text type="success" className="mt-8">
                    Online
                  </Text>
                </div>
              </div>

              <Form
                form={form}
                layout="vertical"
                style={{ maxWidth: 500 }}
                className="mt-24"
              >
                <Form.Item label="Display Name" name="displayName">
                  <Input />
                </Form.Item>

                <Form.Item label="Email" name="email">
                  <Input />
                </Form.Item>

                <Form.Item label="Status Message" name="status">
                  <Input placeholder="What's your status?" />
                </Form.Item>

                
              </Form>
            </Content>
          </Layout>
        </Layout>
      </Modal>
    </div>
  );
};

export default UserSettings;
