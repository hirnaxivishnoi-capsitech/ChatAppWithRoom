import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  Input,
  notification,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useJoinRoom } from "../../Services/RoomService";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";

interface RoomData {
  name: string;
  description?: string;
  privacy: "Private" | "Public";
  membersName: string[];
  totalMembers: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  roomData: any;
  onJoin: (room: RoomData) => void;
}

const { Text, Title } = Typography;

const PreviewRoomModal: React.FC<Props> = ({
  visible,
  onClose,
  roomData,
  onJoin,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>();
  const userInfo = useSelector(userData);
  const JoinRoomMutate = useJoinRoom(userInfo?.id);
  const [api, contextHolder] = notification.useNotification();

  const handleJoin = () => {
    if (roomData?.privacy === "Private") {
      if (!showPassword) {
        setShowPassword(true);
        return;
      }
      if (password && password.trim() !== "") {
        JoinRoomMutate.mutateAsync({
          roomId: roomData?.id,
          userId: userInfo?.id,
          userName: userInfo?.name,
          password: password,
        }).then((data) => {
          if (data?.status === false) {
            api.error({ message: `${data?.message}` });
          } else {
            api.success({ message: `${data?.message}` });
          }
          setTimeout(() => onClose(), 1000);
        });
      } else {
        api.error({ message: "Please enter the password" });
      }
    } else {
      onJoin(roomData);
      JoinRoomMutate.mutateAsync({
        roomId: roomData?.id,
        userId: userInfo?.id,
        userName: userInfo?.name,
      }).then((data) => {
        if (data?.status === false) {
          api.error({ message: `${data?.message}` });
        } else {
          api.success({ message: `${data?.message}` });
        }
        setTimeout(() => onClose(), 1000);
      });
         setTimeout(() => onClose(), 1000);
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={visible}
        onClose={onClose}
        width={420}
        bodyStyle={{ padding: 0, background: "#f9fafb" }}
        headerStyle={{ display: "none" }}
        style={{ borderRadius: "12px 0 0 12px", overflow: "hidden" }}
      >
        <div style={{ position: "relative", padding: "24px" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "140px",
              background:
                "radial-gradient(circle at 30% 30%, #e0e7ff, transparent)",
              zIndex: 0,
            }}
          />

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "16px 20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {roomData?.privacy === "Private" ? (
                <LockOutlined style={{ fontSize: 20, color: "#ef4444" }} />
              ) : (
                <UnlockOutlined style={{ fontSize: 20, color: "#22c55e" }} />
              )}
              <Title level={4} style={{ margin: 0 }}>
                {roomData?.name}
              </Title>
            </div>
            <div style={{ marginTop: 8 }}>
              <Tag color={roomData?.privacy === "Private" ? "red" : "green"}>
                {roomData?.privacy}
              </Tag>
              <Tag color="blue">By {roomData?.createdBy}</Tag>
              <Tag color="purple">
                {dayjs(roomData?.createdAt).format("DD MMM YYYY")}
              </Tag>
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 24px" }}>
          <Text
            type="secondary"
            style={{ fontStyle: roomData?.description ? "normal" : "italic" }}
          >
            {roomData?.description || "No description provided."}
          </Text>
        </div>

        <Divider style={{ margin: "0 0 16px 0" }} />

        <div style={{ padding: "0 24px 16px" }}>
          <Text strong>Members:</Text>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center" }}>
            {roomData?.membersName?.slice(0, 6).map((name: any, i: any) => {
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
            {roomData?.membersName?.length > 6 && (
              <Avatar style={{ backgroundColor: "#ccc", marginLeft: -10 }}>
                +{roomData?.membersName?.length - 6}
              </Avatar>
            )}
          </div>
          <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
            {roomData?.totalMembers} members
          </Text>
        </div>

        <div
          style={{
            padding: "16px 24px",
            background: "#fff",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
            transition: "all 0.3s ease",
          }}
        >
          {showPassword && roomData?.privacy === "Private" && (
            <div style={{ marginBottom: 12, transition: "all 0.3s ease" }}>
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to join room..."
              />
            </div>
          )}
          <Button
            type="primary"
            block
            style={{
              background: "linear-gradient(135deg, #4f46e5, #6366f1)",
              border: "none",
              borderRadius: "8px",
            }}
            onClick={handleJoin}
          >
            {roomData?.privacy === "Private" && !showPassword
              ? "Enter Password to Join"
              : "Join Room"}
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default PreviewRoomModal;
