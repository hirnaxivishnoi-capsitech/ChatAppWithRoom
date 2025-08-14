import { Avatar, Button, Input, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { SendOutlined, SmileOutlined, UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";
import EmojiPicker from "emoji-picker-react";
import TextArea from "antd/es/input/TextArea";

interface ChatComponentProps {
  selectedRoom: any;
  connection: signalR.HubConnection | null;
}

const ChatCompent: React.FC<ChatComponentProps> = ({
  selectedRoom,
  connection,
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
    }[]
  >([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
            joinRoom();
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

  const joinRoom = () => {
    if (connection?.state === "Connected" && selectedRoom?.id) {
      connection.invoke("JoinRoom", selectedRoom?.id, userInfo?.id);

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
          message: m.content,
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
    if (!connection || connection.state !== "Connected" || !selectedRoom?.id)
      return;

    joinRoom();

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
        <div style={{ position: "relative", width: "100%" }} className="mr-16">
          <TextArea
          // className="mr-16"
            placeholder="Type your message..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ borderRadius: 8, borderColor: "gray"}}
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
