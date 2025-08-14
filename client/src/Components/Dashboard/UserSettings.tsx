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
} from "@ant-design/icons";
import "../../Css/UserSettings.css";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";
import { logout } from "../../ApiUtility/axiosInstance";
import { useDeleteRoom, useGetYourRoom } from "../../Services/RoomService";
import dayjs from "dayjs";
import * as signalR from "@microsoft/signalr";
import { useGetUser, useUpdateUser } from "../../Services/UserService";

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

  const handleLeaveRoom = async (roomId: string) => {
    if (connection?.state === "Connected" && roomId && userInfo?.id) {
      try {
        await connection.invoke("LeaveRoom", roomId, userInfo?.id);

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
    <>
      <div className="profile-header">
        <Badge
          dot
          status="success"
          offset={[-4, 28]}
          style={{ padding: "3px" }}
        >
          <Avatar size={48} style={{ backgroundColor: "#7265e6" }}>
            {userInfo?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>

        <div className="user-info">
          <Text strong style={{ fontSize: "1.1rem" }}>
            {userInfo?.name}
          </Text>
          <Text type="secondary" style={{ marginTop: 2 }}>
            {userInfo?.email}
          </Text>
        </div>

        <Button
          icon={<EditOutlined />}
          type="text"
          style={{
            position: "absolute",
            top: "50%",
            right: 16,
            transform: "translateY(-50%)",
          }}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 500 }}
        className="mt-24"
        onFinish={handleSaveProfile}
      >
        <Form.Item label="Display Name" name="name">
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item label="Status Message" name="status">
          <Input disabled={!isEditing} placeholder="What's your status?" />
        </Form.Item>
      </Form>
    </>
  );

  const renderYourRoomsSection = () => (
    <>
      <Title level={4} style={{ marginBottom: 12 }}>
        Manage Rooms
      </Title>
      <Divider style={{ margin: "0 0 24px 0" }} />
      {YourRooms && YourRooms.length > 0 ? (
        <div
          className="room-list-container"
          style={{
            height: "350px",
            overflowY: "scroll",
            padding: "20px",
          }}
        >
          {YourRooms?.map((room: any) => (
            <Card
              key={room?.id}
              className="room-card"
              style={{ marginBottom: "20px" }}
              title={
                <div className="d-flex">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
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
                    <Text strong style={{ fontSize: "1.1rem" }}>
                      {room?.name}
                    </Text>
                  </div>
                  <Tooltip title="Leave Room">
                    <Button
                      type="text"
                      icon={
                        <LogoutOutlined
                          style={{ color: "#22c55e" }}
                          onClick={() => handleLeaveRoom(room?.id)}
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
                      placement="topRight"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
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
                <span>{dayjs(room?.createdAt).format("MMMM D, YYYY")}</span>
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
                  {room?.membersName?.slice(0, 6).map((name: any, i: any) => {
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
                            backgroundColor: colors[i % colors.length],
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
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <UsergroupAddOutlined style={{ color: "#8c8c8c" }} />
                  <Text type="secondary" strong>
                    {room?.totalMembers} members
                  </Text>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Text type="secondary">
          You haven't created any rooms yet. Start by creating one!
        </Text>
      )}
    </>
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
        title={
          <Title level={4} style={{ margin: 0 }}>
            Profile
          </Title>
        }
        onCancel={handleCancel}
        centered
        width={900}
        footer={[
          isEditing && (
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
            >
              Save Changes
            </Button>
          ),
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
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
            </Menu>

            {/* A separate menu for the sign-out button */}
            <div className="sign-out-menu">
              <Menu
                mode="inline"
                onClick={handleLogout}
                className="settings-menu"
                style={{ border: "none" }}
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
            </Content>
          </Layout>
        </Layout>
      </Modal>
    </>
  );
};

export default UserSettings;
