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
  Tooltip,
  Card,
  Popconfirm,
  Row,
  Col,
  Empty,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  FileImageOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  EditOutlined,
  UsergroupAddOutlined,
  HistoryOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import "../../Css/UserSettings.css";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";
import { logout } from "../../ApiUtility/axiosInstance";
import { useDeleteRoom, useGetYourRoom } from "../../Services/RoomService";
import dayjs from "dayjs";
import * as signalR from "@microsoft/signalr";
import { useGetUser, useUpdateUser } from "../../Services/UserService";
import ChangePassword from "./ChangePassword";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

interface UserSettingsProps {
  connection: signalR.HubConnection | null;
}

const UserSettings: React.FC<UserSettingsProps> = ({ connection }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();
  const userInfo = useSelector(userData);
  const { data: YourRooms } = useGetYourRoom(userInfo?.id);
  const [selectedMenuKey, setSelectedMenuKey] = useState("1");
  const DeleteRoomMutate = useDeleteRoom(userInfo?.id);
  const showModal = () => setOpen(true);
  const [api, contextHolder] = notification.useNotification();
  const { mutate: UserUpdateMuate } = useUpdateUser(userInfo?.id);
  const { data: UserDetail } = useGetUser(userInfo?.id);

  const handleCancel = () => {
    setOpen(false);
    setIsEditing(false);
  };

  const handleSaveProfile = (values: any) => {
    setLoading(true);
    let formValues = {
      id: userInfo?.id,
      name: values?.name,
      email: values?.email,
    };
    try {
      UserUpdateMuate(formValues);
      setTimeout(() => {
        // openNotificationWithIcon("success", "Successfully Updated User Data");
        setLoading(false);
        setIsEditing(false);
      }, 1000);
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleCancel();
      api.success({
        message: "Successfully logout.",
        duration: 2,
      });
    } catch {
      api.error({
        message: "Failed to logout. Please try again!",
      });
    }
  };

  const handleDeleteRoom = (room: any) => {
    DeleteRoomMutate.mutateAsync({
      roomId: room?.id,
      userId: userInfo?.id,
    }).then((data: any) => {
      if (data?.status === false) {
        api.error({
          message: `${room?.name} ${data?.message}`,
        });
      } else {
        api.success({ message: `"${room?.name}" ${data?.message} ` });
        handleCancel();
      }
    });
  };

  const handleLeaveRoom = async (room: any) => {
    if (connection?.state === "Connected" && room?.id && userInfo?.id) {
      try {
        await connection.invoke(
          "LeaveRoom",
          room?.id,
          room?.name,
          userInfo?.id,
          userInfo?.name
        );

        api.success({
          message: `You left the room successfully.`,
        });

        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        console.error("Error leaving room:", err);
        api.error({
          message: `Failed to leave the room.`,
        });
      }
    } else {
      console.log("Some error on leaving room");
    }
  };

  useEffect(() => {
    if (UserDetail && "name" in UserDetail && "email" in UserDetail) {
      form.setFieldsValue({
        name: UserDetail.name,
        email: UserDetail.email,
      });
    }
  }, [UserDetail, form]);

  const renderProfileSection = () => (
    <div className="content-section fade-in">
      <Title level={4}>Profile Settings</Title>
      <Divider />
      <Card bordered={false} className="setting-card profile-card">
        <div className="profile-header">
          <Badge status="success" offset={[-4, 28]}>
            <Avatar
              size={64}
              style={{ backgroundColor: "#E9F0F8", color: "#45629B" }}
            >
              {userInfo?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
          <div className="user-info">
            <Title level={4} style={{ margin: 0 }}>
              {userInfo?.name}
            </Title>
            <Text type="secondary">{userInfo?.email}</Text>
          </div>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setIsEditing(!isEditing)}
            className="edit-profile-btn"
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </Button>
        </div>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 500, marginTop: "24px" }}
          onFinish={handleSaveProfile}
        >
          <Form.Item
            label="Display Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input disabled={!isEditing} />
          </Form.Item>
          {/* <Form.Item label="Status Message" name="status">
            <Input disabled={!isEditing} placeholder="What's on your mind?" />
          </Form.Item> */}
          {isEditing && (
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Save Changes
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  );
  const renderYourRoomsSection = () => (
    <div>
      <div className="content-section fade-in">
        <Title level={4}>Manage Rooms</Title>
        <Divider />
        <div className="room-list-container">
          <Row gutter={[24, 24]}>
            {YourRooms && YourRooms.length > 0 ? (
              <>
                {YourRooms?.map((room: any) => (
                  <Col xs={24} sm={12} md={12} key={room?.id}>
                    <Card
                      // key={room?.id}
                      className="room-card"
                      style={{ marginBottom: "20px" }}
                      title={
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
                            <Text
                              strong
                              ellipsis={true}
                              style={{ fontSize: "1.1rem" }}
                              className="room-name"
                            >
                              {room?.name}
                            </Text>
                          </div>
                          <Tooltip title="Leave Room">
                            <Button
                              type="text"
                              icon={
                                <LogoutOutlined
                                  style={{ color: "#22c55e" }}
                                  onClick={() => handleLeaveRoom(room)}
                                />
                              }
                            />
                          </Tooltip>
                        </div>
                      }
                      extra={
                        room?.CreatorId === userInfo?.id && (
                          <>
                            <Popconfirm
                              title="Delete this room?"
                              description="Are you sure you want to delete this room? This action cannot be undone."
                              onConfirm={() => handleDeleteRoom(room)}
                              okText="Yes"
                              okButtonProps={{ danger: true }}
                              cancelText="Cancel"
                              placement="top"
                            >
                              <div className="dropdown-action-item danger">
                                <DeleteOutlined />
                              </div>
                            </Popconfirm>
                            {/* <Tooltip title="Delete Room">
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          setIsDeleteModalVisible(true);
                        }}
                      />
                    </Tooltip> */}

                            {/* <Modal 
                      title="Delete this room?"
                      open={isDeleteModalVisible}
                      onOk={() => {
                        handleDeleteRoom(room?.id);
                        setIsDeleteModalVisible(false);
                      }}
                      onCancel={() => {
                        setIsDeleteModalVisible(false);
                      }}
                      okText="Delete"
                      okButtonProps={{ danger: true }}
                      cancelText="Cancel"
                      centered
                    >
                      <p>
                        Are you sure you want to delete the room **"{room?.name}
                        "**? This action cannot be undone and all data
                        associated with it will be permanently removed.
                      </p>
                    </Modal> */}
                          </>
                        )
                      }
                    >
                      <div
                        style={{
                          marginBottom: 16,
                          fontSize: "0.85rem",
                          color: "#8c8c8c",
                        }}
                      >
                        <span style={{ color: "#595959", fontWeight: "600" }}>
                          {room?.createdBy}
                        </span>
                        <span style={{ margin: "0 6px" }}>•</span>
                        <span>
                          {dayjs(room?.createdAt).format("MMMM D, YYYY")}
                        </span>
                      </div>
                      <Text
                        type="secondary"
                        style={{
                          fontStyle: room?.description ? "normal" : "italic",
                          display: "block",
                          marginBottom: 16,
                        }}
                      >
                        {room?.description || "No description provided."}
                      </Text>
                      <Divider style={{ margin: "8px 0" }} />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
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
                                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <UsergroupAddOutlined style={{ color: "#8c8c8c" }} />
                          <Text type="secondary" strong>
                            {room?.totalMembers} members
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </>
            ) : (
              <Col span={24}>
                <Text type="secondary">
                  You haven't created or joined any rooms yet. Start by creating
                  one!
                </Text>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
  const renderHistorySection = () => (
    <div>
      <Title level={5} style={{ color: "#45629B" }}>
        {YourRooms?.length > 0 &&
          `Deleted Room (${
            YourRooms?.filter((room: any) => room.isDeleted === true).length
          })`}
      </Title>
      {YourRooms?.filter((x:any) => x.isDeleted == true).length > 0 ? (
        <>
          <Text type="secondary" style={{ marginBottom: 16 }}>
            Here are the rooms you have deleted. You can no longer access these.
          </Text>
          <Menu
            mode="inline"
            style={{
              border: "none",
              padding: "8px",
              maxHeight: "600px",
              overflowY: "scroll",
              backgroundColor: "transparent",
              scrollbarWidth: "none",
            }}
          >
            {YourRooms?.filter((val: any) => val.isDeleted === true).map(
              (val: any, index: number) => (
                <Menu.Item
                  key={index}
                  style={{
                    padding: "12px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.2s",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ fontSize: 15, fontWeight: 600 }}>
                        {val?.name}
                      </span>
                      {val?.privacy === "Private" ? (
                        <LockOutlined
                          style={{ color: "#ff7875", fontSize: 14 }}
                        />
                      ) : (
                        <UnlockOutlined
                          style={{ color: "#52c41a", fontSize: 14 }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        color: "#999",
                      }}
                    >
                      <span>{val?.description} </span>
                      <span>{val?.createdBy}</span>
                    </div>
                  </div>
                </Menu.Item>
              )
            )}
          </Menu>
        </>
      ) : (
        <Empty style={{ marginTop: 50 }}
          description="No deleted rooms found."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );

  return (
    <>
      {contextHolder}
      <Tooltip title="User Settings">
        <SettingOutlined
          className="text-center mt-12 fs-16"
          onClick={showModal}
        />
      </Tooltip>
      <Modal
        open={open}
        onCancel={handleCancel}
        centered
        width={900}
        wrapClassName="user-settings-modal"
        footer={[
          <div style={{ padding: "0 24px 24px" }}>
            {isEditing && (
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={() => form.submit()}
                className="mr-16"
              >
                Save Changes
              </Button>
            )}
            <Button key="back" onClick={handleCancel}>
              Close
            </Button>
          </div>,
        ]}
      >
        <Layout className="user-settings-layout">
          <Sider className="settings-sider" width={240}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              selectedKeys={[selectedMenuKey]}
              onClick={(e) => setSelectedMenuKey(e.key)}
              className="settings-menu"
            >
              <Menu.Item key="1" icon={<UserOutlined />}>
                Profile
              </Menu.Item>
              <Menu.Item key="2" icon={<FileImageOutlined />}>
                Manage Rooms
              </Menu.Item>
              <Menu.Item key="3" icon={<HistoryOutlined />}>
                History
              </Menu.Item>
              <Menu.Item key="4" icon={<SecurityScanOutlined />}>
                Settings 
              </Menu.Item>
            </Menu>

            <div className="sign-out-menu">
              <Menu
                mode="inline"
                onClick={handleLogout}
                // className="settings-menu"
                style={{ border: "none", fontWeight: "500" }}
              >
                <Menu.Item key="3" icon={<LogoutOutlined />} danger>
                  Sign Out
                </Menu.Item>
              </Menu>
            </div>
          </Sider>

          <Layout>
            <Content className="settings-content">
              {selectedMenuKey === "1" && renderProfileSection()}
              {selectedMenuKey === "2" && renderYourRoomsSection()}
              {selectedMenuKey === "3" && renderHistorySection()}
              {selectedMenuKey === "4" && <ChangePassword/>}
            </Content>
          </Layout>
        </Layout>
      </Modal>
    </>
  );
};

export default UserSettings;
