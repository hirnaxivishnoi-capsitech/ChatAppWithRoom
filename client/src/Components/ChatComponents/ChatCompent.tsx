import { Avatar, Button, Input, Upload } from "antd";
import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import {
  LogoutOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";
// import { useGetMessagesByRoomId } from "../../Services/MessageService";

const ChatCompent = (selectedRoom: any) => {
  const userInfo = useSelector(userData);
  // const { data } = useGetMessagesByRoomId(selectedRoom?.room?.id);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [messages, setMessages] = useState("");
  const [chat, setChat] = useState<
    {
      userName: any;
      user: string;
      message: string;
    }[]
  >([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7004/chatHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    const startConnection = async () => {
      if (!connection) return;
      try {
        await connection.start();
        joinRoom();
        console.log("Connected to SignalR!");
      } catch (err: any) {
        console.error("Connection error: ", err);
      }
    };

    startConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  const joinRoom = () => {
    if (connection?.state === "Connected" && selectedRoom?.room?.id) {
      connection.invoke("JoinRoom", selectedRoom?.room?.id, userInfo?.id);
      connection.on("UserTyping", ( userName: string) => {
        
        if (userName !== userInfo?.name  ) {
            setTypingUser(userName);
            setTimeout(() => setTypingUser(null), 2000);
        }
        console.log(`${userName} is typing...`);
      });
      connection.on("LoadHistory", (historyMessages: any[]) => {
        const formatted = historyMessages.map((m) => ({
          user: m.senderId.id,
          userName: m.senderId?.name,
          message: m.content,
          createdAt: m.createdAt,
        }));
        setChat(formatted);
      });
      connection.on(
        "ReceiveMessage",
        (roomId, userId, userName, message, createdAt) => {
          if (roomId === selectedRoom?.room?.id) {
            setChat((prevChat) => [
              ...prevChat,
              {
                roomId: roomId,
                user: userId,
                userName: userName,
                message: message.content,
                createdAt: createdAt,
              },
            ]);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (!connection || !selectedRoom?.room?.id) return;

    joinRoom();

    return () => {
      connection.off("UserTyping");
      connection.off("ReceiveMessage");
      connection.off("LoadHistory");
    };
  }, [selectedRoom?.room?.id, connection]);

  const sendMessage = async () => {
    if (
      !selectedRoom?.room?.id ||
      !selectedRoom?.room?.name ||
      !userInfo?.id ||
      !userInfo?.name
    ) {
      console.error("Missing required data for sending message");
      return;
    }
    if (messages.trim() && connection) {
      await connection.invoke(
        "SendMessage",
        selectedRoom?.room?.id,
        selectedRoom?.room?.name,
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
      {chat?.map((msg: any, index: any) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent:
              msg?.user === userInfo?.id ? "flex-end" : "flex-start",
            marginBottom: "10px",
          }}
        >
          {userInfo?.id !== msg?.user && (
            <Avatar className="mr-8 darkLevandarBg">
              {msg?.userName?.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <div
            style={{
              backgroundColor:
                msg?.user === userInfo?.id ? "#E9EEFD" : "#ebebebff",
              padding: "5px 12px 5px 10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            <div>
              {userInfo?.id !== msg?.user && (
                <div className="darkLevandar" style={{ fontWeight: 500 }}>
                  {msg?.userName}
                </div>
              )}
              <span className="mr-8">{msg?.message}</span>

              <small
                className="mt-12"
                style={{ float: "right", fontSize: "10px", color: "#888" }}
              >
                {new Date(msg?.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
          </div>
        </div>
      ))}

      {typingUser && (
        <div className="fs-12" style={{ position: "absolute", bottom: "70px" }}>
          {typingUser} is typing...
        </div>
      )}
      <div ref={messagesEndRef} className="mb-64" />

      <div
        className="d-flex"
        style={{
          width: "75%",
          position: "fixed",
          bottom: 10,
        }}
      >
        <Upload
          showUploadList={false}
          beforeUpload={() => {
            return false;
          }}
        >
          <Button icon={<UploadOutlined />} className="mr-16 mt-12"></Button>
        </Upload>
        <Input.TextArea
          placeholder="Type your message..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          style={{ borderRadius: 8, borderColor: "gray" }}
          className="mr-16"
          value={messages}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setMessages(e.target.value);
            if (connection) {
              connection.invoke(
                "Typing",
                selectedRoom?.room?.id,
                userInfo?.name
              );
            }
          }}
        />
        <div>
          <LogoutOutlined
            style={{ fontSize: "20px" }}
            className="mr-16 mt-16"
            onClick={async () => {
              if (
                connection?.state === "Connected" &&
                selectedRoom.room.id &&
                userInfo?.id
              ) {
                await connection?.invoke(
                  "LeaveRoom",
                  selectedRoom.room.id,
                  userInfo?.id
                );
                window.location.reload();
              } else {
                console.log("Some error onleaving room");
              }
            }}
          />
        </div>
        <SendOutlined
          onClick={sendMessage}
          style={{ fontSize: "20px" }}
          className="mr-16"
        />
      </div>
    </div>
  );
};

export default ChatCompent;
