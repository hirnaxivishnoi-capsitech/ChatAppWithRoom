import React, { useState } from "react";
import {
  Card, Typography, Spin, Button, List, Row, Col,
  Image, Space, Collapse, Divider, Tag, Tabs,
  Tooltip, Avatar, Layout, ConfigProvider, theme
} from "antd";
import {
  BookOutlined, StarFilled, PlayCircleOutlined, CheckCircleOutlined,
  LockOutlined, SolutionOutlined, FileTextOutlined, PlaySquareOutlined,
  TrophyOutlined, UsergroupAddOutlined, ClockCircleOutlined,
  EyeOutlined, ReadOutlined, RightSquareOutlined, FilePptOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Content } = Layout;

// Static data for demonstration
const mockCourseData = {
  id: "course-123",
  title: "Mastering React & Redux",
  tagline: "Build scalable and performant web applications with the modern React ecosystem.",
  description: "A comprehensive course that takes you from React basics to advanced state management with Redux and building full-stack applications.",
  createdBy: { name: "Jane Doe", profileImage: "https://randomuser.me/api/portraits/women/44.jpg" },
  rating: 4.8,
  reviewsCount: 256,
  studentsCount: 1200,
  isEnrolled: false,
  price: 49.99,
  lessons: [
    { id: 'l1', title: 'Introduction to React', duration: 15, isCompleted: true, videoUrl: 'https://www.youtube.com/embed/S_Tz9Lh_H1Y', notes: "This lesson covers the very basics of React, including what React is and why we use it. We'll set up our development environment and write our first 'Hello World' component." },
    { id: 'l2', title: 'JSX and Components', duration: 20, isCompleted: true, videoUrl: 'https://www.youtube.com/embed/S_Tz9Lh_H1Y', notes: "Learn about JSX syntax, a powerful extension to JavaScript, and how to create reusable components." },
    { id: 'l3', title: 'Props and State', duration: 25, isCompleted: false, videoUrl: 'https://www.youtube.com/embed/S_Tz9Lh_H1Y', notes: "A deep dive into Props for passing data and State for managing data within components." },
    { id: 'l4', title: 'React Hooks Deep Dive', duration: 30, isCompleted: false, videoUrl: 'https://www.youtube.com/embed/S_Tz9Lh_H1Y', notes: "Master the most important Hooks: useState, useEffect, and useContext." },
  ],
  sections: [
    {
      title: 'Module 1: React Fundamentals',
      lessons: [
        { id: 'l1', title: 'Introduction to React', duration: 15, isCompleted: true, videoUrl: 'https://www.youtube.com/embed/S_Tz9Lh_H1Y', notes: "This lesson covers the very basics of React." },
        { id: 'l2', title: 'JSX and Components', duration: 20, isCompleted: true, videoUrl: 'https://www.youtube.com/embed/S_Tz9Lh_H1Y', notes: "Learn about JSX syntax and how to create reusable components." },
      ]
    },
    {
      title: 'Module 2: Advanced React Concepts',
      lessons: [
        { id: 'l3', title: 'Props and State', duration: 25, isCompleted: false, videoUrl: 'https://www.youtube.com/embed/S_Tz9Lh_H1Y', notes: "A deep dive into Props and State for dynamic UIs." },
        { id: 'l4', title: 'React Hooks Deep Dive', duration: 30, isCompleted: false, videoUrl: 'https://www.youtube.com/embed/S_Tz9Lh_H1Y', notes: "Master the most important Hooks." },
      ]
    },
  ]
};

// CourseDetails Component
function CourseDetails() {
  const { token } = theme.useToken();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(mockCourseData.isEnrolled);
  const course = mockCourseData;

  const handleLessonClick = (lesson) => {
    if (isEnrolled) {
      setSelectedLesson(lesson);
    }
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    // On enrollment, show the video of the first lesson by default
    setSelectedLesson(course.lessons[0]);
  };

  const totalDuration = course.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;
  const courseDuration = `${hours}h ${minutes}m`;

  const courseInfoItems = [
    { icon: <StarFilled />, label: `${course.rating}`, text: `(${course.reviewsCount} ratings)` },
    { icon: <UsergroupAddOutlined />, label: `${course.studentsCount}`, text: `students` },
    { icon: <ClockCircleOutlined />, label: courseDuration, text: `total length` },
  ];

  const renderEnrollmentCard = () => (
    <Card
      bordered={false}
      style={{ borderRadius: 16, boxShadow: token.boxShadowSecondary, marginBottom: 24, minHeight: 400 }}
      cover={
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <Image
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
            alt="Course thumbnail"
            preview={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Button
            shape="circle"
            icon={<EyeOutlined />}
            size="large"
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', borderColor: 'transparent', color: '#fff' }}
          />
        </div>
      }
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ textAlign: 'center' }}>
        <Title level={3} style={{ marginTop: 0, color: token.colorTextHeading }}>
          ${course.price}
        </Title>
        <Button
          type="primary"
          block
          size="large"
          style={{ height: 48, fontWeight: 600, borderRadius: 8, margin: '16px 0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          icon={<BookOutlined />}
          onClick={handleEnroll}
        >
          Enroll Now
        </Button>
      </div>
      <Divider style={{ margin: '24px 0' }} />
      <Title level={5} style={{ marginBottom: 16 }}>This course includes:</Title>
      <List
        size="small"
        dataSource={[
          { icon: <PlaySquareOutlined />, text: `${course.lessons.length} video lectures` },
          { icon: <TrophyOutlined />, text: 'Certificate of completion' },
          { icon: <FileTextOutlined />, text: 'Downloadable resources' },
          { icon: <ReadOutlined />, text: 'Articles and quizzes' },
        ]}
        renderItem={item => (
          <List.Item style={{ border: 'none', padding: '8px 0' }}>
            <Space>
              <span style={{ color: token.colorPrimary }}>{item.icon}</span>
              <Text>{item.text}</Text>
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );

  const renderProgressCard = () => (
    <Card
      bordered={false}
      style={{ borderRadius: 16, boxShadow: token.boxShadowSecondary, marginBottom: 24, minHeight: 400 }}
      bodyStyle={{ padding: 24, textAlign: 'center' }}
    >
      <TrophyOutlined style={{ fontSize: 64, color: token.colorPrimary }} />
      <Title level={4} style={{ marginTop: 24 }}>Your Course Progress</Title>
      <Paragraph type="secondary">
        Select a lesson from the curriculum to start learning. Your progress will be tracked here.
      </Paragraph>
      <Button type="primary" size="large" icon={<CheckCircleOutlined />}>
        View Certificate
      </Button>
      <Divider />
      <Text strong>Lessons Completed:</Text>
      <br/>
      <Text>2/{course.lessons.length}</Text>
    </Card>
  );

  const videoAndNotes = selectedLesson && (
    <div style={{ marginBottom: 24 }}>
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: token.boxShadowSecondary }} bodyStyle={{ padding: 0 }}>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
          <iframe
            title={selectedLesson.title}
            src={selectedLesson.videoUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>
      </Card>
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: token.boxShadowSecondary, marginTop: 24 }}>
        <Title level={4} style={{ marginBottom: 8 }}>{selectedLesson.title}</Title>
        <Paragraph type="secondary">This is the lesson description.</Paragraph>
        <Divider />
        <Button type="primary" icon={<CheckCircleOutlined />} size="large" style={{ width: '100%' }}>Mark as Completed</Button>
        <div style={{ marginTop: 24, background: token.colorBgLayout, borderRadius: 8, padding: 16 }}>
          <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}><RightSquareOutlined style={{ marginRight: 8, color: token.colorPrimary }} />Lesson Notes</Title>
          <Paragraph>{selectedLesson.notes}</Paragraph>
          <Divider />
          <Title level={5}><FilePptOutlined style={{ marginRight: 8, color: token.colorWarning }} />Downloadable Resources</Title>
          <List
            size="small"
            dataSource={["Lesson Slides (PDF)", "Code Snippets (.zip)", "Exercise Files (.zip)"]}
            renderItem={item => <List.Item style={{ border: 'none', padding: '8px 0' }}><Text>{item}</Text></List.Item>}
          />
        </div>
      </Card>
    </div>
  );

  return (
    <Layout style={{ background: token.colorBgLayout, minHeight: '90vh' }}>
      <Content style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <Spin spinning={false}>
          {/* Top Section: Course Info and Instructor */}
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: token.boxShadowSecondary,
              marginBottom: 24,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            bodyStyle={{ padding: 0 }}
          >
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              <Space direction="vertical" size={4}>
                <Title level={2} style={{ margin: 0, color: token.colorTextHeading }}>{course.title}</Title>
                <Paragraph style={{ color: token.colorTextSecondary, fontSize: 18, fontWeight: 500, margin: 0 }}>{course.tagline}</Paragraph>
              </Space>

              <Divider style={{ margin: 0 }} />

              <Row gutter={[24, 24]} align="middle">
                {/* Course Stats */}
                <Col xs={24} sm={16}>
                  <Space size={24} wrap>
                    {courseInfoItems.map((item, index) => (
                      <Space key={index} direction="vertical" size={2}>
                        <Space>
                          <span style={{ color: token.colorPrimary, fontSize: 18 }}>{item.icon}</span>
                          <Title level={4} style={{ margin: 0 }}>{item.label}</Title>
                        </Space>
                        <Text type="secondary" style={{ fontSize: 12, marginTop: -4 }}>{item.text}</Text>
                      </Space>
                    ))}
                  </Space>
                </Col>

                {/* Instructor */}
                <Col xs={24} sm={8}>
                  <Space size={16} align="center" style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Avatar size={64} src={course.createdBy.profileImage} icon={<UserOutlined />} />
                    <Space direction="vertical" size={2} style={{ textAlign: 'right' }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Taught by</Text>
                      <Title level={4} style={{ margin: 0 }}>{course.createdBy.name}</Title>
                      <Tag icon={<UserOutlined />} color="blue" style={{ borderRadius: 12 }}>Follow</Tag>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Space>
          </Card>

          {/* Bottom Section */}
          <Row gutter={[24, 24]}>
            {/* Left Column: Video Player and Curriculum */}
            <Col xs={24} lg={16}>
              {videoAndNotes}
              
              {/* This is the new position for the course content tabs */}
              <Tabs
                defaultActiveKey="curriculum"
                style={{ background: token.colorBgContainer, borderRadius: 16, boxShadow: token.boxShadowSecondary }}
                tabBarStyle={{ margin: 0, padding: '0 24px', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
              >
                <TabPane tab={<Space><ReadOutlined />Curriculum</Space>} key="curriculum">
                  <div style={{ padding: 24 }}>
                    <Title level={4} style={{ color: token.colorTextHeading }}>Course Content</Title>
                    <Collapse accordion bordered={false} expandIcon={({ isActive }) => <PlaySquareOutlined rotate={isActive ? 90 : 0} />} style={{ background: token.colorBgContainer }}>
                      {course.sections?.map((section, index) => (
                        <Panel key={index} header={<Space size="large"><Text strong>{section.title}</Text><Tag color="blue" style={{ borderRadius: 12 }}>{section.lessons.length} lessons</Tag></Space>}>
                          <List
                            dataSource={section.lessons}
                            renderItem={(lesson, lessonIndex) => (
                              <List.Item
                                key={lessonIndex}
                                style={{ padding: '12px 16px', cursor: isEnrolled ? 'pointer' : 'not-allowed', background: selectedLesson?.id === lesson.id ? token.colorBgBase : 'transparent', transition: 'background-color 0.3s', borderRadius: 8 }}
                                onClick={() => handleLessonClick(lesson)}
                              >
                                <List.Item.Meta
                                  avatar={<Tooltip title={isEnrolled ? "Play lesson" : "Enroll to unlock"}>{isEnrolled ? (lesson.isCompleted ? <CheckCircleOutlined style={{ color: token.colorSuccess }} /> : <PlayCircleOutlined style={{ color: token.colorPrimary }} />) : (<LockOutlined style={{ color: token.colorTextDisabled }} />)}</Tooltip>}
                                  title={<Text>{lesson.title}</Text>}
                                  description={<Text type="secondary">{lesson.duration} min</Text>}
                                />
                              </List.Item>
                            )}
                          />
                        </Panel>
                      ))}
                    </Collapse>
                  </div>
                </TabPane>
                <TabPane tab={<Space><SolutionOutlined />About</Space>} key="about">
                  <div style={{ padding: 24 }}>
                    <Paragraph>{course.description}</Paragraph>
                  </div>
                </TabPane>
              </Tabs>
            </Col>

            {/* Right Column: Dynamic Content */}
            <Col xs={24} lg={8}>
              {isEnrolled ? renderProgressCard() : renderEnrollmentCard()}
            </Col>
          </Row>
        </Spin>
      </Content>
    </Layout>
  );
}

// Wrapper to provide Ant Design theme context
export default function AppWrapper() {
  return (
    <ConfigProvider>
      <CourseDetails />
    </ConfigProvider>
  );
}