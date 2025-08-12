import React, { useState } from "react";
import { Modal, Form, Input, Typography, Tooltip, Tabs, Select } from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import "../../Css/CreateNJoinRoom.css";
import { useCreateRoom, useGetAllRoom } from "../../Services/RoomService";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";

const { TextArea } = Input;
const { Text } = Typography;

const CreateNJoinRoom: React.FC = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState<"public" | "private">("public");
  const [isJoinRoom, setIsJoinRoom] = useState<"create" | "join">("create");
  const [filterRoom, setFilterRoom] = useState<string | undefined>("");
  const { data: allRooms } = useGetAllRoom(filterRoom);
  console.log("all =>", allRooms);
  const userDetail = useSelector(userData);
  const { mutate } = useCreateRoom(userDetail?.id);

  const showModal = () => setOpen(true);

  const handleCancel = () => {
    form.resetFields();
    setRoomType("public");
    setIsJoinRoom("create");
    setOpen(false);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const finalData = {
      Name: values.roomName,
      IsPrivate: roomType === "private",
      Password: values.password || null,
      Description: values.description || "",
      CreatedBy: {
        Id: userDetail.id,
        Name: userDetail.name,
      },
      Members: [
        {
          Id: userDetail.id,
          Name: userDetail.name,
        },
      ],
    };

    try {
      await mutate(finalData);
      handleCancel();
    } catch (error) {
      console.error("Error during room operation:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderExtraFields = () => (
    <>
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
        {isJoinRoom !== "join" ? (
          <Input placeholder="Enter room name" />
        ) : (
          <Select
            showSearch
            onClick={(e: any) => setFilterRoom(e)}
            // style={{ width: 200 }}
            placeholder="Search to Select"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              String(optionA?.label ?? "")
                .toLowerCase()
                .localeCompare(String(optionB?.label ?? "").toLowerCase())
            }
            options={allRooms?.map((room: any) => ({
              value: room.id,
              label: room.name,
            }))}
          />
        )}
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
    </>
  );

  return (
    <>
      <Tooltip title="Create or Join a Room">
        <UsergroupAddOutlined onClick={showModal} className="mt-24 fs-20" />
      </Tooltip>

      <Modal
        open={open}
        title="Create or Join a Room"
        onCancel={handleCancel}
        onOk={() => form.submit()}
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
            { key: "create", label: "Create a Room" },
            { key: "join", label: "Join a Room" },
          ]}
        />

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

        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {renderExtraFields()}
        </Form>
      </Modal>
    </>
  );
};

export default CreateNJoinRoom;
