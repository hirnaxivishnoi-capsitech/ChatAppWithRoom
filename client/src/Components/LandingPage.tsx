import React, { useCallback, useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const LandingPage = () => {
  const steps = [
    {
      step: 1,
      title: "Create or Join a Room",
      description:
        "Start by creating your own room or joining an existing one.",
      icon: "https://cdn-icons-png.flaticon.com/128/5500/5500817.png",
      bgColor: "#E0F7FA",
    },
    {
      step: 2,
      title: "Start Chatting",
      description:
        "Communicate in real time using sockets with typing indicators.",
      icon: "https://cdn-icons-png.flaticon.com/128/3845/3845696.png",
      bgColor: "#E8F5E9",
    },
    {
      step: 3,
      title: "Share Files",
      description:
        "Send documents, images, emojis, and messages easily and securely.",
      icon: "https://cdn-icons-png.flaticon.com/128/8901/8901575.png",
      bgColor: "#F3E5F5",
    },
  ];
  const handleMouseEnter = useCallback((e: any) => {
    e.currentTarget.style.transform = "translateY(-6px)";
    e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.1)";
  }, []);

  const handleMouseLeave = useCallback((e: any) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.05)";
  }, []);
  const navigate = useNavigate();
  const features = [
    {
      icon: "https://cdn-icons-png.flaticon.com/128/1048/1048896.png",
      title: "Fast Performance",
      color: "#ffe6e6",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/5676/5676710.png",
      title: "Private Rooms",
      color: "#e6f7ff",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/17540/17540879.png",
      title: "Public Rooms",
      color: "#fff0f6",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/438/438623.png",
      title: "File Sharing",
      color: "#f9f0ff",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/2518/2518052.png",
      title: "Typing Indicators",
      color: "#f0fff0",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/4515/4515252.png",
      title: "Emoji Support",
      color: "#fffbe6",
    },
  ];
  const [activeTab, setActiveTab] = useState<any>("teams");

  const content = {
    teams: {
      title: "For Teams",
      description:
        "Create private rooms for secure team collaboration, manage tasks, share files, and stay connected with real-time updates.",
      image: "Selectingteam-amico.png", 
    },
    communities: {
      title: "For Communities",
      description:
        "Join public chat rooms, discover new people, and have meaningful conversations with interactive features and emoji reactions.",
      image: "GroupChat-amico.svg",
    },
  };
  return (
    <div className="page-container">
      <Header />
      <div className="d-flex my-32">
        <img
          src="BannerGirl1.png"
          width={"45%"}
          className="mx-8"
          style={{ borderRadius: "10px" }}
          alt="Illustration of user chatting"
        />
        <div className="w-50">
          <h1 className="">Real-Time Connection, Your Way.</h1>
        
           <p className=" w-75">
            Dive into a world where your words flow freely and your ideas come to life. Create private havens for your conversations or join vibrant public communities. With features like **real-time typing indicators** and dynamic **emoji reactions**, every interaction becomes meaningful.
          </p>
          <div>
            <Button className="btn btn-dark mx-4 "  onClick={() => navigate("/login")}>
          Get Started <ArrowRightOutlined className="mx-4"  />
            </Button>
            {/* <button
              className="btn btn-dark"
              onClick={() => navigate("/register")}
            >
              Create Your First Room <ArrowRightOutlined className="mx-4" />
            </button> */}
          </div>
        </div>
      </div>
      {/* <div className="logo-marquee" style={{ backgroundColor: "white" }}>
        <div className="logo-track">
          <img src="https://cdn-icons-png.flaticon.com/128/733/733585.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733553.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733579.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733585.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733553.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733579.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733585.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733553.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733579.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733585.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733553.png" />
          <img src="https://cdn-icons-png.flaticon.com/128/733/733579.png" />
        </div>
      </div> */}
      <div style={{ background: "linear-gradient(135deg, #f9f9f9, #e6ecff)", padding: "2rem 2rem" }}>
  <h1
    style={{
      textAlign: "center",
      color: "#45629bff",
      fontSize: "2.5rem",
      marginBottom: "2rem",
    }}
  >
        How HiveChat Powers Real-Time Connection
      </h1>
      <div className="d-flex">
        <div
          className="px-16"
          style={{ justifyContent: "center", margin: "auto" }}
        >
          <Row gutter={[18, 18]}>
            <Col span={12}>
              <div className="equal-height-card">
                <Card
                  title={
                    <span className="d-center">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                        width="24"
                        className="mr-8"
                      />
                      What Can HiveChat Do?
                    </span>
                  }
                  variant="borderless"
                  className="custom-card"
                  style={{ backgroundColor: "#FDF1F5" }}
                >
                  HiveChat is a real-time messaging platform that allows you to
                  create and join custom chat rooms for public or private
                  conversations with advanced features like file sharing and
                  typing indicators.
                </Card>
              </div>
            </Col>

            <Col span={12}>
              <div className="equal-height-card">
                <Card
                  title={
                    <span className="d-center">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/2910/2910791.png"
                        width="24"
                        className="mr-8"
                      />
                      Top Features
                    </span>
                  }
                  variant="borderless"
                  className="custom-card"
                  style={{ backgroundColor: "#EFFCFA" }}
                >
                  Real-time messaging using WebSockets, create and join chat
                  rooms (public/private), typing indicators, emoji reactions,
                  file/image uploads, and persistent message history.
                </Card>
              </div>
            </Col>

            <Col span={12}>
              <div className="equal-height-card">
                <Card
                  title={
                    <span className="d-center">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/3665/3665934.png"
                        width="24"
                        className="mr-8"
                      />
                      Our Technology
                    </span>
                  }
                  variant="borderless"
                  className="custom-card"
                  style={{ backgroundColor: "#E8F1FB" }}
                >
                  Built with React + TypeScript frontend, ASP.NET Core backend,
                  WebSocket connections, JWT Authentication, and modern UI
                  components - ensuring fast, secure, and scalable
                  communication.
                </Card>
              </div>
            </Col>

            <Col span={12}>
              <div className="equal-height-card">
                <Card
                  title={
                    <span className="d-center">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/1828/1828884.png"
                        width="24"
                        className="mr-8"
                      />
                      Why Choose Us?
                    </span>
                  }
                  variant="borderless"
                  className="custom-card"
                  style={{ backgroundColor: "#FFF1E6" }}
                >
                  Unlike bloated chat tools, HiveChat offers flexibility and
                  simplicity. Create custom chat spaces tailored to your needs
                  with real-time features that enhance your communication
                  experience.
                </Card>
              </div>
            </Col>
          </Row>
        </div>
        <img src="Girl.png" width={400} />
      </div>
      </div>
      
    <div style={{ backgroundColor: "#F9F9F9", padding: "3rem 0.5rem" }}>
      <h2 className="text-center" style={{ color: "#45629bff", fontSize: "32px", fontWeight: "700" }}>
        HiveChat Features at a Glance
      </h2>

      <Row gutter={[24, 24]} justify="center" className="">
        {features.map((feature, index) => (
          <Col key={index} xs={12} sm={8} md={6} lg={4}>
            <div
              style={{
                // backgroundColor: feature.bg,
                padding: "2rem",
                borderRadius: "20px",
                textAlign: "center",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.06)";
              }}
            >
              <img src={feature.icon} width={40} alt={feature.title} style={{ marginBottom: "1rem" }} />
              <div style={{ fontWeight: 600, fontSize: "16px", color: "#45629bff" }}>{feature.title}</div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
      <div style={{ background: "linear-gradient(135deg, #f9f9f9, #e6ecff)", padding: "2rem 2rem" }}>
     
      <div className="d-flex px-16"
       >
        <img
          src={content[activeTab as keyof typeof content].image}
          alt={content[activeTab as keyof typeof content].title}
          width="40%"
          style={{ borderRadius: "12px" }}
        />
        <div style={{ width: "50%", paddingLeft: "2rem" }}>
        <h2 style={{  color:'#45629bff',fontSize:'2rem'}} className="d-center">
       <img src='/HiveChatLogo.png' width={41.8} className="mr-8"/> HiveChat: Your Space, Your Rules
      </h2>
      <div className="d-flex" style={{ justifyContent: 'start',marginTop:'1rem' }}>
  <Button
    onClick={() => setActiveTab("teams")}
    style={{
      marginRight: "1rem",
      backgroundColor: activeTab === "teams" ? "#45629bff" : "#fff",
      color: activeTab === "teams" ? "#fff" : "#45629bff",
      border: `1px solid ${activeTab === "teams" ? "#45629bff" : "#ccc"}`,
      transition: "all 0.3s ease",
    }}
  >
    Teams
  </Button>
  <Button
    onClick={() => setActiveTab("communities")}
    style={{
      backgroundColor: activeTab === "communities" ? "#45629bff" : "#fff",
      color: activeTab === "communities" ? "#fff" : "#45629bff",
      border: `1px solid ${activeTab === "communities" ? "#45629bff" : "#ccc"}`,
      transition: "all 0.3s ease",
    }}
  >
    Communities
  </Button>
</div>

          <h3 style={{ fontSize: "24px", color: "#45629bff" }}>{content[activeTab as keyof typeof content].title}</h3>
          <p style={{ fontSize: "16px", color: "#555" }}>{content[activeTab as keyof typeof content].description}</p>
        </div>
      </div>
    </div>
      <div style={{ backgroundColor: "#fff", padding: "1rem 0" }}>
        <h2 className="text-center" style={{color:'#45629bff'}}>
          How It Works
        </h2>
        <Row gutter={32} justify="center" style={{ padding: "2rem 5rem" }}>
          {steps.map((item, index) => (
            <Col key={index} span={6}>
              <div
                style={{
                  backgroundColor: item.bgColor,
                  borderRadius: "16px",
                  padding: "2rem",
                  textAlign: "center",
                  transition: "transform 0.3s ease",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    margin: "0 auto 1rem",
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <img src={item.icon} alt={item.title} width="30" />
                </div>
                <h3 style={{ margin: "1rem 0 0.5rem" }}>{item.title}</h3>
                <p style={{ color: "#555", fontSize: "14px" }}>
                  {item.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
     
      {/* <div style={{ backgroundColor: "#fff", padding: "3rem 0" }}>
  <h2 className="text-center mb-16 text-gradient-animate">What Users Say</h2>
  <Row gutter={18} justify="center" className="px-16">
    <Col span={8}>
      <Card>
        <p>"HiveChat made remote teamwork so easy. The typing indicators are 🔥!"</p>
        <strong>- Priya, Developer</strong>
      </Card>
    </Col>
    <Col span={8}>
      <Card>
        <p>"I love the simplicity. I created a community chat in 5 minutes."</p>
        <strong>- Ayan, Community Manager</strong>
      </Card>
    </Col>
  </Row>
</div> */}

      <Footer />
    </div>
  );
};

export default LandingPage;
