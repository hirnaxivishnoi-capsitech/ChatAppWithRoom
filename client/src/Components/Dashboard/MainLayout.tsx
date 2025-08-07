import React from "react";
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Input,
  Divider,
  Button,
  List,
  Dropdown,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  MessageOutlined,
  PlusOutlined,
  LockOutlined,
  SendOutlined,
  MoreOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";
import ChatCompent from "../ChatComponents/ChatCompent";
import CreateNJoinRoom from "../ChatComponents/CreateNJoinRoom";
import UserSettings from "./UserSettings";

const { Sider, Content, Header } = Layout;
const { Text, Title } = Typography;

const SidebarLayout: React.FC = () => {
  const selector = useSelector(userData);
  const rooms = [
    {
      key: "1",
      label: "General",
      subtitle: "Alice Smith: Welcome to the general chat!",
      icon: <MessageOutlined />,
    },
    {
      key: "2",
      label: "Development Team",
      subtitle: "Bob Johnson: Let's discuss the new features",
      icon: <LockOutlined />,
    },
  ];

  const availableRooms = [
    {
      key: "3",
      label: "Random",
      subtitle: "For random conversations",
      icon: <MessageOutlined />,
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <span
        // onClick={handleLeaveRoom}
        >
          <LogoutOutlined style={{ marginRight: 8 }} />
          Leave Room
        </span>
      ),
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        width={300}
        style={{
          backgroundColor: "#fff",
          borderRight: "1px solid #eee",
        }}
      >
        <div className="p-8">
          <div className="d-center ">
            <img src="/Logo.png" alt="Logo" width={40} />
            <span className="fs-24 darkLevandar" style={{ fontWeight: 800 }}>
              Ryzo
            </span>
          </div>
        </div>
        <Divider style={{ margin: "7px 0 12px 0" }} />
        <div className="d-flex px-8">
          <div className="d-flex">
            <Avatar className="mr-8" style={{ backgroundColor: "#7265e6" }}>
              {selector?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Text strong>{selector?.name}</Text>
              <br />
              <Text type="success" style={{ fontSize: 12 }}>
                ● Online
              </Text>
            </div>
          </div>
          <UserSettings/>
          {/* <SettingOutlined className="fs-16" /> */}
        </div>
        <Divider style={{ margin: "7px 0 15px 0" }} />
        <div className="px-8">
          <Input.Search className="my-8" placeholder="Search rooms..." />

          <div className="d-flex">
            <Title level={5} >Your Rooms (2)</Title>
            <CreateNJoinRoom />
          </div>
          <Menu mode="inline" defaultSelectedKeys={["1"]}>
            {rooms.map((room) => (
              <Menu.Item key={room.key} icon={room.icon}>
                <div>
                  <div>{room.label}</div>
                  <div className="fs-12" style={{ color: "#999" }}>
                    {room.subtitle}
                  </div>
                </div>
              </Menu.Item>
            ))}
          </Menu>
        </div>
        <Divider />
        <div className="px-8">
          <Title level={5}>Available Rooms (1)</Title>
          <Menu mode="inline">
            {availableRooms.map((room) => (
              <Menu.Item key={room.key} icon={room.icon}>
                <div style={{ padding: "10px 0px 10px 0px" }}>
                  <div>{room.label}</div>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    {room.subtitle}
                  </div>
                </div>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            backgroundColor: "#fff",
            padding: "5px 20px",
            borderBottom: "1px solid #eee",
          }}
          className="d-flex"
        >
          <div>
            <Title level={4} style={{ margin: 0 }}>
              # General
            </Title>
            <Text type="secondary">
              156 members · General discussion for everyone
            </Text>
          </div>

          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <MoreOutlined style={{ fontSize: "20px" }} />
          </Dropdown>
        </Header>

        <Content style={{ overflowY: "auto" }}>
          {" "}
          <div
            className="d-flex"
            style={{
              justifyContent: "space-between",
              padding: 20,
              borderTop: "1px solid #eee",
              // background: "#fff",
            }}
          >
            <ChatCompent />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;
