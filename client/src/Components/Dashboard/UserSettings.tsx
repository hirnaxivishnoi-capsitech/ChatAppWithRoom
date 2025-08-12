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
  notification,
  Tag,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  FileImageOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "../../Css/UserSettings.css";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";
import { logout } from "../../ApiUtility/axiosInstance";
import { useGetYourRoom } from "../../Services/RoomService";
import dayjs from "dayjs";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

type NotificationType = "success" | "info" | "warning" | "error";
type NotificationMessage =
  | "Successfully Updated User Data"
  | "Logout Successfully"
  | "Feature coming soon!";

const UserSettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const userInfo = useSelector(userData);
  const { data: YourRooms } = useGetYourRoom(userInfo?.id);
  const [selectedMenuKey, setSelectedMenuKey] = useState("1");

  const showModal = () => setOpen(true);

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    message: NotificationMessage
  ) => {
    api[type]({
      message: message,
    });
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        displayName: userInfo.name,
        email: userInfo.email,
        // status: userInfo?.status || "",
      });
    }
  }, []);

  return (
    <div>
      {contextHolder}
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
              openNotificationWithIcon(
                "success",
                "Successfully Updated User Data"
              );
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
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              selectedKeys={[selectedMenuKey]}
              onClick={(e) => setSelectedMenuKey(e.key)}
            >
              <Menu.Item key="1" icon={<UserOutlined />}>
                Profile
              </Menu.Item>
              {/* <Menu.Item key="2" icon={<BellOutlined />}>
                Notifications
              </Menu.Item>
              <Menu.Item key="3" icon={<LockOutlined />}>
                Privacy
              </Menu.Item>
              <Menu.Item
                key="4"
                icon={<BgColorsOutlined />}
              >
                Appearance
              </Menu.Item> */}
              <Menu.Item
                key="5"
                icon={<FileImageOutlined />}
                onClick={() => {
                  // openNotificationWithIcon("success", "Logout Successfully");
                }}
              >
                Your Rooms
              </Menu.Item>
              <Menu.Item
                key="6"
                icon={<LogoutOutlined />}
                danger
                onClick={() => {
                  logout();
                  openNotificationWithIcon("success", "Logout Successfully");
                }}
              >
                Sign Out
              </Menu.Item>
            </Menu>
          </Sider>

          <Layout>
            <Content className="settings-content">
              {selectedMenuKey === "1" && (
                <>
                  <div className="profile-header">
                    <Badge dot status="success" offset={[-1, 46]}>
                      <Avatar size={64} style={{ backgroundColor: "#7265e6" }}>
                        {userInfo?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                    <div className="user-info">
                      <Title level={4}>{userInfo?.name}</Title>
                      <Text type="secondary">{userInfo?.email}</Text>
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
                </>
              )}

              {/* {selectedMenuKey === "5" && (
                <>
                  <Title level={4}>Your Rooms</Title>
                  <Divider />
                  {YourRooms && YourRooms.length > 0 ? (
                    <div style={{height:'350px',overflowY:'scroll',scrollbarWidth:'none',padding:'10px'}}>
                      {YourRooms?.map((room: any) => (
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: "16px 20px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                            position: "relative",
                            zIndex: 1,
                            marginBottom: " 20px",
                          }}
                        >
                          <div>
                            <div className="d-flex">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                }}
                              >
                                {room?.privacy === "Private" ? (
                                  <LockOutlined
                                    style={{ fontSize: 20, color: "#ef4444" }}
                                  />
                                ) : (
                                  <UnlockOutlined
                                    style={{ fontSize: 20, color: "#22c55e" }}
                                  />
                                )}
                                <Title level={4} style={{ margin: 0 }}>
                                  {room?.name}
                                </Title>
                              </div>
                              <div>
                                <span
                                  style={{ color: "red", cursor: "pointer" }}
                                >
                                  <DeleteOutlined className="mr-8" />
                                </span>
                                <span
                                // onClick={handleLeaveRoom}
                                >
                                  <LogoutOutlined
                                    className="mr-8"
                                    style={{
                                      color: "#22c55e",
                                      cursor: "pointer",
                                    }}
                                  />
                                </span>
                              </div>
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <Tag
                                color={
                                  room?.privacy === "Private" ? "red" : "green"
                                }
                              >
                                {room?.privacy}
                              </Tag>
                              <Tag color="blue">By {room?.createdBy}</Tag>
                              <Tag color="purple">
                                {dayjs(room?.createdAt).format("DD MMM YYYY")}
                              </Tag>
                            </div>
                          </div>

                          <div style={{ padding: "16px 24px" }}>
                            <Text
                              type="secondary"
                              style={{
                                fontStyle: room?.description
                                  ? "normal"
                                  : "italic",
                              }}
                            >
                              {room?.description || "No description provided."}
                            </Text>
                          </div>

                          <Divider style={{ margin: "0 0 16px 0" }} />

                          <div style={{ padding: "0 24px 16px" }}>
                            <Text strong>Members:</Text>
                            <div
                              style={{
                                marginTop: 12,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {room?.membersName
                                ?.slice(0, 6)
                                .map((name: any, i: any) => {
                                  const colors = [
                                    "#FF6B6B",
                                    "#4ECDC4",
                                    "#FFD93D",
                                    "#6A4C93",
                                    "#1A535C",
                                    "#FF9F1C",
                                  ];
                                  return (
                                    <Tooltip key={i} title={name}>
                                      <Avatar
                                        style={{
                                          backgroundColor:
                                            colors[i % colors.length],
                                          border: "2px solid white",
                                          marginLeft: i === 0 ? 0 : -10,
                                          boxShadow:
                                            "0 2px 6px rgba(0,0,0,0.15)",
                                        }}
                                      >
                                        {name.charAt(0).toUpperCase()}
                                      </Avatar>
                                    </Tooltip>
                                  );
                                })}
                              {room?.membersName?.length > 6 && (
                                <Avatar
                                  style={{
                                    backgroundColor: "#ccc",
                                    marginLeft: -10,
                                  }}
                                >
                                  +{room?.membersName?.length - 6}
                                </Avatar>
                              )}
                            </div>
                            <Text
                              type="secondary"
                              style={{ display: "block", marginTop: 8 }}
                            >
                              {room?.totalMembers} members
                            </Text>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Text type="secondary">No rooms found.</Text>
                  )}
                </>
              )} */}
            </Content>
          </Layout>
        </Layout>
      </Modal>
    </div>
  );
};

export default UserSettings;
