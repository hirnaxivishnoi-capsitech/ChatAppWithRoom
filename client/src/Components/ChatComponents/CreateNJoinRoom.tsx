import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Typography,
  message,
  Tooltip,
  Tabs,
  Button,
} from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import "../../Css/CreateNJoinRoom.css";

const { TextArea } = Input;
const { Text } = Typography;

const CreateNJoinRoom: React.FC = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState<"public" | "private">("public");
  const [isJoinRoom, setIsJoinRoom] = useState<"create" | "join">("create");

  const showModal = () => setOpen(true);
  const handleCancel = () => {
    form.resetFields();
    setRoomType("public");
    setIsJoinRoom("create");
    setOpen(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      const finalData = {
        ...values,
        roomType,
      };

      console.log(
        isJoinRoom === "create" ? "Room Created:" : "Joining Room:",
        finalData
      );

      setTimeout(() => {
        message.success(
          isJoinRoom === "create"
            ? `Room "${values.roomName}" created successfully as ${roomType.toUpperCase()}!`
            : `Joined room "${values.roomName}" successfully!`
        );
        setLoading(false);
        setOpen(false);
        form.resetFields();
        setRoomType("public");
        setIsJoinRoom("create");
      }, 1000);
    });
  };

  const formContent = () => (
    <>
      <div className="room-type-toggle">
        <div
          className={`room-type-option ${
            roomType === "public" ? "activePublic" : ""
          }`}
          onClick={() => setRoomType("public")}
        >
          <UnlockOutlined className="publicIcon" />
          <div>
            <Text strong>Public</Text>
            <br />
            <Text type="secondary">Anyone can join</Text>
          </div>
        </div>

        <div
          className={`room-type-option ${
            roomType === "private" ? "activePrivate" : ""
          }`}
          onClick={() => setRoomType("private")}
        >
          <LockOutlined className="privateIcon" />
          <div>
            <Text strong>Private</Text>
            <br />
            <Text type="secondary">Invite only</Text>
          </div>
        </div>
      </div>

      <Form layout="vertical" form={form}>
        <Form.Item
          label={
            <>
              Room Name{" "}
              <Tooltip title="Name must be unique" className="mx-8">
                <InfoCircleOutlined />
              </Tooltip>
            </>
          }
          name="roomName"
          rules={[{ required: true, message: "Please enter a room name" }]}
        >
          <Input placeholder="Enter room name" />
        </Form.Item>

        {roomType === "private" && (
          <Form.Item
            label="Room Password"
            name="password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password
              placeholder="Enter password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
        )}

        {isJoinRoom === "create" && (
          <Form.Item label="Room Description (Optional)" name="description">
            <TextArea
              rows={3}
              placeholder="What's this room about?"
              showCount
              maxLength={200}
            />
          </Form.Item>
        )}
      </Form>
    </>
  );

  return (
    <>
      <Tooltip title="Create or Join a Room">
        {/* <Button onClick={showModal} className="mt-24">Create or Join room</Button> */}
        <TeamOutlined  onClick={showModal} className="mt-24 fs-20" />
        {/* <PlusOutlined onClick={showModal} className="mt-16" /> */}
      </Tooltip>

      <Modal
        open={open}
        title="Create or Join a Room"
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText={isJoinRoom === "create" ? "Create Room" : "Join Room"}
        cancelText="Cancel"
        confirmLoading={loading}
        centered
        className="ryzo-room-modal"
      >
        <Tabs
          activeKey={isJoinRoom}
          onChange={(key) => setIsJoinRoom(key as "create" | "join")}
          items={[
            {
              key: "create",
              label: "Create a Room",
              children: formContent(),
            },
            {
              key: "join",
              label: "Join a Room",
              children: formContent(),
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default CreateNJoinRoom;
