import { Avatar, Button, Input } from "antd";
import React, { useEffect, useState } from "react";
// import connection from "../../SignalRConnection/signalrConnection";
import * as signalR from "@microsoft/signalr";
import { SendOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";
import CreateNJoinRoom from "./CreateNJoinRoom";

const ChatCompent = () => {
  const selector = useSelector(userData);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [messages, setMessages] = useState("");
  const [chat, setChat] = useState<{ user: string; message: string }[]>([]);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7004/chatHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR!");
          connection.on("ReceiveMessage", (user, message) => {
            setChat((prevChat) => [...prevChat, { user, message }]);
          });
        })
        .catch((err: any) => console.error("Connection error: ", err));

      return () => {
        connection.stop();
      };
    }
  }, [connection]);

  const sendMessage = async () => {
    if (messages.trim() && connection) {
      await connection.invoke("SendMessage", selector?.name, messages);
      setMessages("");
    }
  };

  return (
    <div>
      {chat.map((msg, index) => (
        <div
          key={index}
          className="darkLevandar"
          style={{
            marginBottom: "10px",
            backgroundColor: "white",
            padding: "10px 12px 20px 10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            
          }}
        >
          <p className="d-center ">
            <Avatar className="mr-8 darkLevandarBg">
              {msg.user.charAt(0).toUpperCase()}
            </Avatar>
            - {msg.message}
          </p>
          <small style={{ float: "right", fontSize: "10px", color: "#888" }}>
            {new Date().toLocaleTimeString()}
          </small>
        </div>
      ))}
      {/* <Input
        placeholder="Enter your name"
        style={{
          width: "300px",
          marginBottom: "10px",
          border: "1px solid black",
        }}
        value={user}
        onChange={(e) => setUser(e.target.value)}
      /> */}
      <div
        className="d-flex"
        style={{
          width: "960px",
          paddingTop: "420px",
          position: "fixed",
          bottom: 10,
        }}
      >
        <Input.TextArea
          placeholder="Type your message..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          style={{ borderRadius: 8, borderColor: "gray" }}
          className="mr-16"
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
        />
        <SendOutlined onClick={sendMessage} style={{ fontSize: "20px" }} className="mr-16" />
      </div>
    </div>
  );
};

export default ChatCompent;
