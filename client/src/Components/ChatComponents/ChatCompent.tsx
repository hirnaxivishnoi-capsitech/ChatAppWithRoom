import { Avatar, Button, Card, Space, Typography, Upload } from "antd";
import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import {
  DownloadOutlined,
  FileOutlined,
  SendOutlined,
  SmileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";
import EmojiPicker from "emoji-picker-react";
import TextArea from "antd/es/input/TextArea";
import { useUploadFile } from "../../Services/UploadFileService";
import dayjs from "dayjs";

interface ChatComponentProps {
  selectedRoom: any;
  connection: signalR.HubConnection | null;
  showMembers: boolean;
}

const ChatCompent: React.FC<ChatComponentProps> = ({
  selectedRoom,
  connection,
  showMembers,
}) => {
  const userInfo = useSelector(userData);
  // const [connection, setConnection] = useState<signalR.HubConnection | null>(
  //   null
  // );
  const [messages, setMessages] = useState("");
  const [chat, setChat] = useState<
    {
      userName: any;
      user: string;
      message: string;
      createdAt: string;
    }[]
  >([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const UploadFileMutation = useUploadFile();

  const onEmojiClick = (emojiObject: any) => {
    setMessages((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //   const newConnection = new signalR.HubConnectionBuilder()
  //     .withUrl("https://localhost:7004/chatHub")
  //     .withAutomaticReconnect()
  //     .build();

  //   setConnection(newConnection);
  // }, []);

  useEffect(() => {
    if (!connection) return;

    if (connection.state !== "Connected") {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR!");
          if (selectedRoom?.id) {
            connectToRoom();
          }
        })
        .catch((err) => console.error("Connection error: ", err));
    } else {
      // if (selectedRoom?.id) {
      //   joinRoom();
      // }
    }

    return () => {
      connection.off("UserTyping");
      connection.off("ReceiveMessage");
      connection.off("LoadHistory");
    };
  }, [connection, selectedRoom?.id]);

  const connectToRoom = () => {
    if (connection?.state === "Connected" && selectedRoom?.id) {
      connection.invoke(
        "JoinRoom",
        selectedRoom?.id,
        selectedRoom?.name,
        userInfo?.id,
        userInfo?.name
      );

      connection.on("UserTyping", (roomId: any, userName: string) => {
        if (roomId === selectedRoom?.id && userName !== userInfo?.name) {
          setTypingUser(userName);
          setTimeout(() => setTypingUser(null), 1000);
        }

        console.log(`${userName} is typing...`);
      });
      connection.on("LoadHistory", (historyMessages: any[]) => {
        const formatted = historyMessages.map((m) => ({
          user: m.senderId.id,
          userName: m.senderId?.name,
          // message: m.content,
          message: m.content || m.fileUrl,
          fileName: m.fileName,
          messageType: m.messageType,
          createdAt: m.createdAt,
        }));
        setChat(formatted);
      });
      connection.on(
        "ReceiveMessage",
        (roomId, userId, userName, message, createdAt) => {
          if (roomId === selectedRoom?.id) {
            setChat((prevChat) => [
              ...prevChat,
              {
                roomId: roomId,
                user: userId,
                userName: userName,
                message: message.content || message.fileUrl,
                fileName: message.fileName,
                messageType: message.messageType,
                // message: message.content,
                createdAt: createdAt,
              },
            ]);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (!connection || connection.state !== "Connected" || !selectedRoom?.id)
      return;

    connectToRoom();

    return () => {
      connection.off("UserTyping");
      connection.off("ReceiveMessage");
      connection.off("LoadHistory");
    };
  }, [selectedRoom?.id, connection]);

  const sendMessage = async () => {
    if (
      !selectedRoom?.id ||
      !selectedRoom?.name ||
      !userInfo?.id ||
      !userInfo?.name
    ) {
      console.error("Missing required data for sending message");
      return;
    }
    if (messages.trim() && connection) {
      await connection.invoke(
        "SendMessage",
        selectedRoom?.id,
        selectedRoom?.name,
        userInfo?.id,
        userInfo?.name,
        messages
      );

      setMessages("");
    }
  };
  // const allMessages = [
  //   ...(data || []).map(
  //     (m: {
  //       id: any;
  //       senderId: any;
  //       senderName: any;
  //       content: any;
  //       createdAt: any;
  //     }) => ({
  //       id: m.id,
  //       user: m.senderId,
  //       userName: m.senderName,
  //       message: m.content,
  //       createdAt: m.createdAt,
  //     })
  //   ),
  //   ...chat,
  // ];

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {chat?.map((msg: any, index: any) => {
        const prevMsg = chat[index - 1];
        const currentDate = dayjs(msg?.createdAt).format("MMMM DD, YYYY");
        const prevDate = prevMsg
          ? dayjs(prevMsg.createdAt).format("MMMM DD, YYYY")
          : null;
        const showDate = currentDate !== prevDate;
        const getFormattedDate = (date: any) => {
          const today = dayjs().startOf("day");
          const messageDate = dayjs(currentDate).startOf("day");
          const diffDays = today.diff(messageDate, "day");

          if (diffDays === 0) return "Today";
          if (diffDays === 1) return "Yesterday";
          if (diffDays < 7) return messageDate.format("dddd");
          return messageDate.format("DD MMM YYYY");
        };

        return (
          <div key={index}>
            {showDate && (
              <div className="text-center">
                <Typography.Title
                  level={5}
                  style={{
                    fontSize: "12px",
                    margin: "20px 0",
                    color: "#45629bff",
                    fontStyle: "normal",
                    letterSpacing: "0.2px",
                    padding: "6px 14px",
                    borderRadius: "16px",
                    display: "inline-block",
                    backgroundColor: "#F3F4F6",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  {getFormattedDate(currentDate)}
                </Typography.Title>
              </div>
            )}
            <div
              // key={index}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent:
                  msg?.messageType === 4
                    ? "center"
                    : msg?.user === userInfo?.id
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "10px",
              }}
            >
              {userInfo?.id !== msg?.user && msg.messageType !== 4 && (
                <Avatar
                  className="mr-8 "
                  style={{
                    backgroundColor: "#457B9D",
                    color: "#fff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    width: 40,
                    height: 40,
                    fontSize: "16px",
                  }}
                >
                  {msg?.userName?.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {userInfo?.id !== msg?.user && msg.messageType !== 4 && (
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#333",
                      marginBottom: "4px",
                    }}
                  >
                    {msg?.userName}
                  </div>
                )}

                <div
                  style={{
                    backgroundColor:
                      msg?.messageType === 4
                        ? "#e3e2e2ff"
                        : msg?.user === userInfo?.id
                        ? "#1D3557"
                        : "#F0F4F7",
                    color:
                      msg?.messageType === 4
                        ? "#666565ff"
                        : msg?.user === userInfo?.id
                        ? "#fff"
                        : "#1D3557",
                    padding:
                      msg?.messageType === 3 ||
                      msg?.messageType === 2 ||
                      msg?.messageType === 4
                        ? "6px"
                        : "12px 18px",
                    borderRadius: msg?.messageType === 4 ? "8px" : "20px",
                    borderBottomLeftRadius:
                      msg?.messageType === 4
                        ? "6px"
                        : msg?.user === userInfo?.id
                        ? "20px"
                        : "4px",
                    borderBottomRightRadius:
                      msg?.messageType === 4
                        ? "6px"
                        : msg?.user === userInfo?.id
                        ? "4px"
                        : "20px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    wordWrap: "break-word",
                    animation: "fade-in 0.3s ease-out",
                    position: "relative",
                  }}
                >
                  <div className={`${msg?.messageType === 4 ? "d-flex" : ""}`}>
                    {msg?.messageType === 4 ? (
                      <div
                        style={{
                          fontStyle: "italic",
                        }}
                      >
                        {msg?.user === userInfo?.id
                          ? `You ${msg.message}`
                          : `${msg.userName} ${msg.message}`}
                      </div>
                    ) : (
                      <>
                        {msg?.messageType === 1 && <span>{msg.message}</span>}

                        {msg?.messageType === 2 && (
                          <Card
                            size="small"
                            hoverable
                            style={{
                              width: 250,
                              borderRadius: "12px",
                              overflow: "hidden",
                              position: "relative",
                            }}
                            bodyStyle={{ padding: 0 }}
                          >
                          
                            <a
                              href={msg.message}
                              target="_blank"
                              // rel="noopener noreferrer"
                              // download
                              // style={{
                              //   position: "absolute",
                              //   top: "8px",
                              //   right: "8px",
                              //   backgroundColor: "rgba(0,0,0,0.5)",
                              //   borderRadius: "50%",
                              //   padding: "4px",
                              //   display: "flex",
                              //   alignItems: "center",
                              //   justifyContent: "center",
                              // }}
                            >
                                <img
                              src={msg.message}
                              alt="uploaded"
                              style={{
                                width: "100%",
                                display: "block",
                              }}
                            />
                              {/* <DownloadOutlined
                                style={{ color: "#fff", fontSize: "16px" }}
                              /> */}
                            </a>
                          </Card>
                        )}

                        {msg?.messageType === 3 && (
                          <div
                            style={{
                              padding: "12px 18px",
                              borderRadius: "20px",
                              borderBottomLeftRadius:
                                msg?.user === userInfo?.id ? "20px" : "4px",
                              borderBottomRightRadius:
                                msg?.user === userInfo?.id ? "4px" : "20px",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                              backgroundColor:
                                msg?.user === userInfo?.id
                                  ? "rgba(255,255,255,0.1)"
                                  : "#E8F0F7",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <FileOutlined
                              style={{ fontSize: "24px", flexShrink: 0 }}
                            />
                            <div style={{ flex: 1, overflow: "hidden" }}>
                              <Typography.Text
                                strong
                                ellipsis
                                style={{
                                  color:
                                    msg?.user === userInfo?.id
                                      ? "#fff"
                                      : "#1D3557",
                                }}
                              >
                                {msg.fileName || "File"}
                              </Typography.Text>
                            </div>
                            <a
                              href={msg.message}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              <Button
                                shape="circle"
                                icon={<DownloadOutlined />}
                                style={{
                                  backgroundColor:
                                    msg?.user === userInfo?.id
                                      ? "rgba(255,255,255,0.2)"
                                      : "#1D3557",
                                  color:
                                    msg?.user === userInfo?.id
                                      ? "#fff"
                                      : "#fff",
                                  border: "none",
                                  flexShrink: 0,
                                }}
                              />
                            </a>
                          </div>
                        )}
                      </>
                    )}

                    {/* <span className="mr-8 ">{msg?.message}</span> */}

                    <small
                      className="mt-12 ml-8"
                      style={{
                        float: "right",
                        fontSize: "10px",
                        color:
                          msg?.messageType === 4
                            ? "#888"
                            : msg?.user === userInfo?.id
                            ? "rgba(255,255,255,0.7)"
                            : "#888",
                      }}
                    >
                      {new Date(msg?.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {typingUser && (
        <div className="fs-12" style={{ position: "absolute", bottom: "65px" }}>
          {typingUser} is typing...
        </div>
      )}
      <div ref={messagesEndRef} className="mb-64" />

      <div
        className="d-flex"
        style={{
          position: "fixed",
          bottom: 10,
          left: 320,
          right:showMembers ? 320:  10,
          alignItems: "flex-end",
        }}
      >
        {/* <Upload
          showUploadList={false}
          beforeUpload={(file: File) => {
            UploadFileMutation.mutate({
              file,
              roomId: selectedRoom.id,
              roomName: selectedRoom.name,
              userId: userInfo.id,
              userName: userInfo.name,
            });
            return false;
          }}
        >
          <Button icon={<UploadOutlined />} className="mr-16 mt-12"></Button>
        </Upload> */}
        <Upload
          showUploadList={false}
          beforeUpload={(file: File) => {
            UploadFileMutation.mutate(
              {
                file,
                roomId: selectedRoom.id,
                roomName: selectedRoom.name,
                userId: userInfo.id,
                userName: userInfo.name,
              }
            );
            return false;
          }}
        >
          <Button icon={<UploadOutlined />} className="mr-16 mt-12"></Button>
        </Upload>

        <div style={{ position: "relative", flex: 1 }} className="mr-16">
          <TextArea
            // className="mr-16"
            placeholder="Type your message..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ borderRadius: 8, borderColor: "gray", width: "100%" }}
            value={messages}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setMessages(e.target.value);
              if (connection) {
                setTimeout(() => {
                  if (connection) {
                    connection.invoke(
                      "Typing",
                      selectedRoom?.id,
                      userInfo?.name
                    );
                  }
                }, 500);
              }
            }}
          />
          <SmileOutlined
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 20,
              cursor: "pointer",
              color: "#888",
            }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />

          {showEmojiPicker && (
            <div style={{ position: "absolute", bottom: "50px", right: 0 }}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        <Button
          type="primary"
          shape="circle"
          className="mr-16 mt-4"
          icon={<SendOutlined />}
          size="large"
          onClick={sendMessage}
          disabled={!messages.trim()}
          style={{
            backgroundColor: messages.trim() ? "#457B9D" : "#ced0d2ff",
            border: "none",
            color: messages.trim() ? "#ced0d2ff" : "gray",
            transition: "background-color 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};

export default ChatCompent;
