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
  Space,
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
  const [showMembers, setShowMembers] = useState(false);

  const handleClick = (room: any) => {
    setSelectedRoom(room);
  };

  const handleRoomPreviewModal = (room: any) => {
    setselectedAvailableRoom(room);
    setPreviewModal(true);
  };

  // const handleJoinRoom = () => {};

  const handleJoinRoom = (room: any) => {
    setSelectedRoom(room);
    setPreviewModal(false);
  };

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

  const handleLeaveRoom = async (slectedRoom: any) => {
    if (connection?.state === "Connected" && slectedRoom?.id && userInfo?.id) {
      try {
        await connection.invoke(
          "LeaveRoom",
          slectedRoom?.id,
          slectedRoom?.name,
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
      handleLeaveRoom(selectedRoom);
    }
  };

  // useEffect(() => {
  //   if (YourRooms?.length > 0) {
  //     setSelectedRoom(YourRooms[0]);
  //   } else if (AvailableRooms?.length > 0) {
  //     //  setSelectedRoom(AvailableRooms[0])
  //   }
  // }, [searchRoom, YourRooms]);

  useEffect(() => {
    if (!selectedRoom && YourRooms?.length > 0) {
      setSelectedRoom(YourRooms[0]);
    }

    if (searchRoom) {
      setSelectedRoom(
        YourRooms?.find((room: any) =>
          room.name.toLowerCase().includes(searchRoom.toLowerCase())
        ) || null
      );
    }
  }, [searchRoom, YourRooms, selectedRoom]);

  console.log("Rooms", YourRooms);

  return (
    <>
      {contextHolder}
      <Layout style={{ height: "100vh" }}>
        <Sider
          width={300}
          style={{
            borderRight: "2px solid #D5E1F0",
            background: "linear-gradient(180deg, #E8F0F8, #F8FAFF)",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          <div className="p-8">
            <div className="d-center">
              <img
                src="/HiveChatLogo.png"
                alt="Hive Logo"
                width={41.8}
                // style={{ marginRight: "12px" }}
              />
              <span
                className=""
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  background: "linear-gradient(40deg, #8e45abff, #6AC4FA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "Poppins",
                }}
              >
                HiveChat
              </span>
            </div>
          </div>
          <Divider style={{ margin: "7px 0 12px 0" }} />
          <div className="d-flex px-8">
            <div className="d-flex">
              <Avatar
                className="mr-8"
                size={40}
                style={{
                  backgroundColor: "#fff",
                  color: "#1D3557",
                  fontWeight: "500",
                  border: "2px solid #E0EAFC",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
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
                      ? `Your Rooms (${
                          YourRooms?.filter(
                            (room: any) => room.isDeleted === false
                          ).length
                        })`
                      : "Create or Join Room"}
                  </Title>
                </Col>
                <Col>
                  <CreateNJoinRoom connection={connection} />
                </Col>
              </Row>

              {YourRooms?.length > 0 ? (
                <Menu
                  mode="inline"
                  defaultSelectedKeys={["0"]}
                  style={{
                    border: "none",
                    padding: "8px",
                    maxHeight: "300px",
                    overflowY: "scroll",
                    backgroundColor: "transparent",
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
                  {YourRooms?.filter(
                    (val: any) => val?.isDeleted === false
                  ).map((val: any, index: number) => (
                    <Menu.Item
                      onClick={() => handleClick(val)}
                      key={index}
                      // style={{
                      //   padding: "12px",
                      //   marginBottom: "8px",
                      //   borderRadius: "8px",
                      //   backgroundColor: "#fff",
                      //   boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      //   transition: "all 0.2s",
                      // }}
                      style={{
                        padding: "28px 16px 28px 5px",
                        marginBottom: "12px",
                        borderRadius: "6px",
                        backgroundColor:
                          selectedRoom?.id === val.id ? "#E6F4FF" : "#FFFFFF",
                        boxShadow:
                          selectedRoom?.id === val.id
                            ? "0 4px 12px rgba(42, 157, 143, 0.15)"
                            : "0 2px 8px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                        transform:
                          selectedRoom?.id === val.id
                            ? "scale(1.02)"
                            : "scale(1)",
                        borderLeft:
                          selectedRoom?.id === val.id
                            ? "4px solid #45629bff"
                            : "none",
                        position: "relative",
                        color:
                          selectedRoom?.id === val.id ? "#45629bff" : "black",
                      }}
                    >
                      <div className="d-flex">
                        <div className="d-center">
                          {val?.roomImage ? (
                            <img
                              src={val?.roomImage}
                              // alt="Hive Logo"
                              style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Avatar
                              // className="mr-8"
                              size={40}
                              style={{
                                backgroundColor: "#fff",
                                color: "#1D3557",
                                fontWeight: "500",
                                border: "2px solid #E0EAFC",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                              }}
                            >
                              {val?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                          )}

                          {/* {val?.name?.charAt(0).toUpperCase()} */}
                          <span
                            className="ml-8"
                            style={{ fontSize: 15, fontWeight: 600 }}
                          >
                            {val?.name}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            fontSize: 12,
                            color: "#999",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
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
                          {/* <span>{val?.totalMembers} members</span> */}
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
                  `Available Rooms (${
                    AvailableRooms?.filter(
                      (room: any) => room.isDeleted === false
                    ).length
                  })`}
              </Title>

              <Menu
                mode="inline"
                style={{
                  border: "none",
                  padding: "8px",
                  maxHeight: "200px",
                  overflowY: "scroll",
                  backgroundColor: "transparent",
                  scrollbarWidth: "none",
                  //   height: AvailableRooms?.length > 0 ? 150 : 0,
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
                    <div className="d-flex">
                      <div className="d-center">
                        {val?.roomImage ? (
                          <img
                            src={val?.roomImage}
                            // alt="Hive Logo"
                            style={{
                              width: "35px",
                              height: "35px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Avatar
                            // className="mr-8"
                            size={40}
                            style={{
                              backgroundColor: "#fff",
                              color: "#1D3557",
                              fontWeight: "500",
                              border: "2px solid #E0EAFC",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            }}
                          >
                            {val?.name?.charAt(0).toUpperCase()}
                          </Avatar>
                        )}

                        {/* {val?.name?.charAt(0).toUpperCase()} */}
                        <span
                          className="ml-8"
                          style={{ fontSize: 15, fontWeight: 600 }}
                        >
                          {val?.name}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          fontSize: 12,
                          color: "#999",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
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
                        {/* <span>{val?.totalMembers} members</span> */}
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
              padding: "0 20px",
              height: 64, // Default Antd Header height
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space
              size="middle"
              style={{ cursor: "pointer" }}
              onClick={() => setShowMembers((prev) => !prev)}
            >
              {selectedRoom && (
                <>
              { selectedRoom?.roomImage ? (
                <img
                  src={selectedRoom?.roomImage}
                  alt="Room"
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Avatar
                  size={40}
                  style={{
                    backgroundColor: "#fff",
                    color: "#1D3557",
                    fontWeight: "500",
                    border: "2px solid #E0EAFC",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  {selectedRoom?.name?.charAt(0).toUpperCase()}
                </Avatar>
              )}
              </>
            )}
              <Space direction="vertical" size={-4}>
                <Title level={4} style={{ margin: 0, lineHeight: 1 }}>
                  {selectedRoom?.name || "Select a room"}
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {selectedRoom?.description && (
                    <span> {selectedRoom.description}</span>
                  )}
                </Text>
              </Space>
            </Space>
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
                  showMembers={showMembers}
                />
              )}
            </div>
          </Content>
        </Layout>
        {showMembers && (
          <div
            style={{
              width: "300px",
              borderLeft: "2px solid #D5E1F0",
              padding: "20px",
              background: "linear-gradient(180deg, #E8F0F8, #F8FAFF)",
              overflowY: "auto",
            }}
          >
            <Title level={5} style={{ color: "#1D3557", marginBottom: "20px" }}>
              Participants
            </Title>
            {selectedRoom?.membersName?.map((name: string, index: number) => {
              // Logic for dynamic avatar color (for variety)
              const avatarColors = [
                "#2A9D8F",
                "#E9C46A",
                "#F4A261",
                "#E76F51",
                "#52A9C6",
              ];
              const randomColor = avatarColors[index % avatarColors.length];

              const isCurrentUser = name === userInfo?.name;
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                    padding: "10px 14px",
                    borderRadius: 20,
                    background: isCurrentUser
                      ? "linear-gradient(90deg, #FFFFFF, #E0EAFC)"
                      : "#FFFFFF",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
                    fontWeight: 600,
                    color: "#333",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: "scale(1)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      style={{
                        backgroundColor: randomColor,
                        marginRight: 12,
                        boxShadow: `0 2px 4px ${randomColor + "66"}`,
                      }}
                    >
                      {name.charAt(0).toUpperCase()}
                    </Avatar>
                    {name}
                  </div>
                  {isCurrentUser && (
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        backgroundColor: "#2A9D8F",
                        color: "#fff",
                        fontWeight: "normal",
                      }}
                    >
                      You
                    </span>
                  )}
                </div>
              );
            })}

            <div
              style={{
                marginTop: "30px",
                paddingTop: "20px",
                borderTop: "2px dashed #E0EAFC",
              }}
            >
              <Title
                level={5}
                style={{ color: "#1D3557", marginBottom: "15px" }}
              >
                Room Details
              </Title>
              <div
                style={{
                  fontSize: "14px",
                  color: "#4A5568",
                  lineHeight: "1.8",
                }}
              >
                <div style={{ marginBottom: "12px" }}>
                  <p style={{ margin: "0", fontWeight: 600, color: "#333" }}>
                    Room Name:
                  </p>
                  <p style={{ margin: "4px 0 0", color: "#666" }}>
                    {selectedRoom?.name}
                  </p>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <p style={{ margin: "0", fontWeight: 600, color: "#333" }}>
                    Created By:
                  </p>
                  <p style={{ margin: "4px 0 0", color: "#666" }}>
                    {selectedRoom?.createdBy}
                  </p>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <p style={{ margin: "0", fontWeight: 600, color: "#333" }}>
                    Members:
                  </p>
                  <p style={{ margin: "4px 0 0", color: "#666" }}>
                    {selectedRoom?.membersName?.length}
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", fontWeight: 600, color: "#333" }}>
                    Description:
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#666",
                      fontStyle: "italic",
                    }}
                  >
                    {selectedRoom?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
