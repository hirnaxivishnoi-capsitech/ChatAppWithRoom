import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Typography,
  Tooltip,
  Tabs,
  Select,
  notification,
  Upload,
  Button,
  Row,
  Col,
} from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
  UsergroupAddOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "../../Css/CreateNJoinRoom.css";
import {
  useCreateRoom,
  useGetAvaliableRoom,
  useJoinRoom,
} from "../../Services/RoomService";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";
import * as signalR from "@microsoft/signalr";
const { TextArea } = Input;
const { Text } = Typography;
interface ChatComponentProps {
  connection: signalR.HubConnection | null;
  // selectedRoom: any;
}
const CreateNJoinRoom: React.FC<ChatComponentProps> = ({ connection }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState<"public" | "private">("public");
  const [isJoinRoom, setIsJoinRoom] = useState<"create" | "join">("create");
  const [filterRoom, setFilterRoom] = useState<string | undefined>("");
  const [selectedJoinRoomId, setSelectedJoinRoomId] = useState<
    string | undefined
  >();
  const userInfo = useSelector(userData);
  const CreateRoomMutation = useCreateRoom(userInfo?.id);
  const { data: avaliableRoom } = useGetAvaliableRoom(userInfo?.id);
  const JoinRoomMutation = useJoinRoom(userInfo?.id);

  const [api, contextHolder] = notification.useNotification();

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
        Id: userInfo.id,
        Name: userInfo.name,
      },
      Members: [
        {
          Id: userInfo.id,
          Name: userInfo.name,
        },
      ],
    };

    try {
      if (isJoinRoom === "create") {
        //  await CreateRoomMutation.mutateAsync(formData as any);
        await CreateRoomMutation.mutateAsync({
          Name: values.roomName,
          IsPrivate: roomType === "private",
          Password: values.password || null,
          Description: values.description || "",
          UserId: userInfo.id,
          UserName: userInfo.name,
          RoomImage: values.roomImage,
        }).then((data: any) => {
          if (data?.status === false) {
            api.error({ message: `${data?.message}` });
          } else {
            api.success({ message: `${data?.message}` });
            handleCancel();
          }
        });

        // if (data?.status === false) {
        //   api.error({
        //     message: `${data?.message}`,
        //   });
        // } else {
        //   api.success({ message: `"${data.result.name}" ${data?.message}` });
        // }
        // handleCancel();
      } else {
        if (!selectedJoinRoomId) {
          api.error({ message: "Please select a room to join." });
          setLoading(false);
          return;
        }
        const selectedRoom = avaliableRoom.find(
          (r: any) => r.id === selectedJoinRoomId
        );

        const data = await JoinRoomMutation.mutateAsync({
          roomId: selectedJoinRoomId,
          userId: userInfo?.id,
          userName: userInfo?.name,
          password:
            selectedRoom?.privacy === "Private" ? values.password : undefined,
        });
        if (data?.status === false) {
          api.error({ message: `${data?.message}` });
        } else {
          api.success({ message: `${data?.message}` });
          //     if (connection && connection.state === "Connected") {
          //   await connection.invoke(
          //     "JoinRoom",
          //     selectedJoinRoomId,
          //     userInfo?.id,
          //     userInfo?.name
          //   );
          // }

          handleCancel();
        }
      }
    } catch (error: any) {
      api.error({
        message: `${error?.message} ` || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderExtraFields = () => (
    <>
      <Row gutter={[8, 4]}>
        <Col span={isJoinRoom === "create" ? 22 : 24}>
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
                onChange={(e: any) => {
                  setSelectedJoinRoomId(e);
                  e.target.value === ""
                    ? setSelectedJoinRoomId(undefined)
                    : null;
                }}
                allowClear
                placeholder="Search to Select"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  String(optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare(String(optionB?.label ?? "").toLowerCase())
                }
                options={avaliableRoom?.map((room: any) => ({
                  value: room.id,
                  label: room.name,
                }))}
              />
            )}
          </Form.Item>
        </Col>
        {isJoinRoom === "create" && (
          <Col>
            <Form.Item
              name="roomImage"
              className="mt-30"
              valuePropName="file"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList?.[0]?.originFileObj;
              }}
            >
              <Upload
                showUploadList={false}
                beforeUpload={() => {
                  // UploadFileMutation.mutate({
                  //   file,
                  //   roomId: selectedRoom.id,
                  //   roomName: selectedRoom.name,
                  //   userId: userInfo.id,
                  //   userName: userInfo.name,
                  // });
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}></Button>
              </Upload>
            </Form.Item>
          </Col>
        )}
      </Row>

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
      {contextHolder}
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
        className="hivechat-room-modal"
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
