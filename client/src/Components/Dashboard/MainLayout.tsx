import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Input,
  Divider,
  Dropdown,
  Empty,
  notification,
  Row,
  Col,
} from "antd";
import {
  LockOutlined,
  MoreOutlined,
  LogoutOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";
import ChatCompent from "../ChatComponents/ChatCompent";
import CreateNJoinRoom from "../ChatComponents/CreateNJoinRoom";
import UserSettings from "./UserSettings";
import {
  useGetAvaliableRoom,
  useGetYourRoom,
} from "../../Services/RoomService";
import PreviewRoomModal from "../ChatComponents/PreviewRoomModal";
import * as signalR from "@microsoft/signalr";

const { Sider, Content, Header } = Layout;
const { Text, Title } = Typography;

const SidebarLayout: React.FC = () => {
  const [searchRoom, setSearchRoom] = useState<string | undefined>();
  const userInfo = useSelector(userData);
  const {
    data: YourRooms,
    isLoading,
    isError,
  } = useGetYourRoom(userInfo?.id, searchRoom);
  const { data: AvailableRooms } = useGetAvaliableRoom(
    userInfo?.id,
    searchRoom
  );
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedAvailableRoom, setselectedAvailableRoom] = useState<any>(null);
  const [previewModal, setPreviewModal] = useState<boolean>(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [api, contextHolder] = notification.useNotification();
  const handleClick = (room: any) => {
    setSelectedRoom(room);
  };

  const handleRoomPreviewModal = (room: any) => {
    setselectedAvailableRoom(room);
    setPreviewModal(true);
  };

  const handleJoinRoom = () => {};

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7004/chatHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  // useEffect(() => {
  //   const startConnection = async () => {
  //     if (!connection) return;
  //     try {
  //       await connection.start();
  //       // joinRoom();
  //       console.log("Connected to SignalR!");
  //     } catch (err: any) {
  //       console.error("Connection error: ", err);
  //     }
  //   };

  //   startConnection();

  //   return () => {
  //     if (connection) {
  //       connection.stop();
  //     }
  //   };
  // }, [connection]);

  // const handleLeaveRoom = async () => {
  //   if (connection?.state === "Connected" && selectedRoom?.id && userInfo?.id) {
  //     await connection?.invoke("LeaveRoom", selectedRoom?.id, userInfo?.id);
  //     window.location.reload();
  //   } else {
  //     console.log("Some error onleaving room");
  //   }
  // };

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

  const items = [
    {
      key: "1",
      label: (
        <span>
          <LogoutOutlined className="mr-8" />
          Leave Room
        </span>
      ),
    },
  ];

  const handleMenuClick = (e: any) => {
    if (e.key === "1" && selectedRoom?.id) {
      handleLeaveRoom(selectedRoom.id);
    }
  };

  useEffect(() => {
    if (YourRooms?.length > 0) {
      setSelectedRoom(YourRooms[0]);
    } else if (AvailableRooms?.length > 0) {
      //  setSelectedRoom(AvailableRooms[0])
    }
  }, [searchRoom, YourRooms]);

  return (
    <>
      {contextHolder}
      <Layout style={{ height: "100vh" }}>
        <Sider
          width={300}
          style={{
            background: "white",
            //  background: "linear-gradient(135deg, #f9f9f9, #e6ecff)",
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
              <Avatar
                className="mr-8 darkLevandarBg"
                style={{ backgroundColor: "" }}
              >
                {userInfo?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Text strong>{userInfo?.name}</Text>
                <br />
                <Text type="success" style={{ fontSize: 12 }}>
                  ● Online
                </Text>
              </div>
            </div>
            <UserSettings connection={connection} />
            {/* <SettingOutlined className="fs-16" /> */}
          </div>
          <Divider style={{ margin: "7px 0 15px 0" }} />

          <Input.Search
            className="my-8 px-8"
            placeholder="Search rooms..."
            onSearch={(value: any) => {
              setSearchRoom(value);
            }}
            onChange={(e: any) => {
              e.target.value === "" ? setSearchRoom(undefined) : null;
            }}
            allowClear
          />
          <>
            <div className="px-8">
              <Row className="d-flex">
                <Col>
                  <Title level={5}>
                    {YourRooms?.length > 0
                      ? `Your Rooms (${YourRooms?.length})`
                      : "Create or Join Room"}
                  </Title>
                </Col>
                <Col>
                  <CreateNJoinRoom />
                </Col>
              </Row>

              {YourRooms?.length > 0 ? (
                <Menu
                  mode="inline"
                  defaultSelectedKeys={["0"]}
                  style={{
                    border: "none",
                    padding: "8px",
                    height: AvailableRooms?.length > 0 ? 150 : 300,
                    overflowY: "scroll",
                    // backgroundColor: "#",
                    scrollbarWidth: "none",
                  }}
                >
                  {isLoading && (
                    <div style={{ padding: 20 }}>Loading rooms...</div>
                  )}
                  {isError && (
                    <div style={{ padding: 20, color: "red" }}>
                      Failed to load rooms
                    </div>
                  )}
                  {YourRooms?.map((val: any, index: number) => (
                    <Menu.Item
                      onClick={() => handleClick(val)}
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
                          <span>{val?.totalMembers} members</span>
                          <span>{val?.createdBy}</span>
                        </div>
                      </div>
                    </Menu.Item>
                  ))}
                </Menu>
              ) : (
                <Empty
                  description="No rooms available yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
            <Divider />
            <div className="px-8">
              <Title level={5}>
                {AvailableRooms?.length > 0 &&
                  `Available Rooms (${AvailableRooms?.length})`}
              </Title>

              <Menu
                mode="inline"
                style={{
                  border: "none",
                  padding: "8px",
                  height: AvailableRooms?.length > 0 ? 150 : 0,
                  overflowY: "scroll",
                  // backgroundColor: "#",
                  scrollbarWidth: "none",
                }}
              >
                {AvailableRooms?.map((val: any, index: number) => (
                  <Menu.Item
                    onClick={() => handleRoomPreviewModal(val)}
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
                        <span>{val?.totalMembers} members</span>
                        <span>{val?.createdBy}</span>
                      </div>
                    </div>
                  </Menu.Item>
                ))}
              </Menu>
            </div>
          </>
          {/* )} */}
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
              <Title level={4} style={{ margin: 0, display: "flex" }}>
                {selectedRoom?.name ?? "Select a  room"}
                <span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 8,
                    }}
                  >
                    {selectedRoom?.membersName
                      ?.slice(0, 5)
                      .map((item: any, index: number) => {
                        const colors = [
                          "#FF6B6B",
                          "#4ECDC4",
                          "#FFD93D",
                          "#6A4C93",
                          "#1A535C",
                          "#FF9F1C",
                        ];
                        const bgColor = colors[index % colors.length];

                        return (
                          <Avatar
                            key={index}
                            style={{
                              backgroundColor: bgColor,
                              border: "2px solid white",
                              marginLeft: index === 0 ? 0 : -10,
                              zIndex: selectedRoom.membersName.length - index,
                              fontWeight: "bold",
                            }}
                          >
                            {item?.charAt(0).toUpperCase()}
                          </Avatar>
                        );
                      })}
                    {selectedRoom?.membersName?.length > 5 && (
                      <Avatar
                        style={{
                          backgroundColor: "#ccc",
                          marginLeft: -10,
                          fontSize: 12,
                          fontWeight: "bold",
                          border: "2px solid white",
                        }}
                      >
                        +{selectedRoom.membersName.length - 5}
                      </Avatar>
                    )}
                  </span>
                </span>
              </Title>
              <Text type="secondary">
                <span> {selectedRoom?.membersName?.length ?? 0} members </span>
                {selectedRoom?.description && (
                  <span>- {selectedRoom.description}</span>
                )}
              </Text>
            </div>
            <Dropdown
              menu={{ items, onClick: handleMenuClick }}
              placement="bottomRight"
              arrow
            >
              <MoreOutlined style={{ fontSize: "20px" }} />
            </Dropdown>
          </Header>

          <Content
            style={{
              overflowY: "scroll",
              scrollbarWidth: "none",
              backgroundColor: "#fff",
              backgroundImage: 'url("/Frame.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="d-flex"
              style={{
                justifyContent: "space-between",
                padding: 20,
                borderTop: "1px solid #eee",
              }}
            >
              {selectedRoom && (
                <ChatCompent
                  selectedRoom={selectedRoom}
                  connection={connection}
                />
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
      {previewModal && (
        <PreviewRoomModal
          onClose={() => setPreviewModal(false)}
          onJoin={handleJoinRoom}
          roomData={selectedAvailableRoom}
          visible={true}
        />
      )}
    </>
  );
};

export default SidebarLayout;
