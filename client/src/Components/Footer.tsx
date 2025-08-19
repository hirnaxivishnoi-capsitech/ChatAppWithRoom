import React from "react";
import { GithubOutlined, LinkedinOutlined, MailOutlined, TwitterOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";

const Footer: React.FC = () => {
  return (
    <div style={{ backgroundColor: "#E8F0F8", padding: "40px 80px", marginTop: "50px" }}>
      <Row gutter={32}>
        {/* Logo and Description */}
        <Col xs={24} md={8}>
         <div className="d-center">
          <img src="/HiveChatLogo.png" width={41.8}/>
          <h2   style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  background: "linear-gradient(40deg, #8e45abff, #6AC4FA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "Poppins",
                }}>HiveChat</h2>
        </div>
          <p style={{ marginTop: 12, color: "#45629bff" }}>
            HiveChat helps you stay connected with real-time messaging, create custom chat rooms, 
            and enjoy interactive features like file sharing and typing indicators.
          </p>
        </Col>

        {/* Helpful Links */}
        <Col xs={24} md={8}>
          <h4 >Explore</h4>
          <ul style={{ listStyle: "none", padding: 0, fontSize: "16px", lineHeight: "28px" }}>
            <li><a href="/features" style={{ color: "#45629bff", textDecoration: "none" }}>Features</a></li>
            <li><a href="/rooms" style={{ color: "#45629bff", textDecoration: "none" }}>Chat Rooms</a></li>
            <li><a href="/file-sharing" style={{ color: "#45629bff", textDecoration: "none" }}>File Sharing</a></li>
            <li><a href="/faqs" style={{ color: "#45629bff", textDecoration: "none" }}>FAQs</a></li>
            <li><a href="/terms" style={{ color: "#45629bff", textDecoration: "none" }}>Terms & Conditions</a></li>
          </ul>
        </Col>

        {/* Social Media & Contact */}
        <Col xs={24} md={8}>
          <h4 >Follow Us</h4>
          <div style={{ fontSize: "22px", marginBottom: 10 }}>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <LinkedinOutlined style={{ marginRight: 16, color: "#45629bff" }} />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <GithubOutlined style={{ marginRight: 16, color: "#45629bff" }} />
            </a>
            <a href="mailto:contact@hivechat.com">
              <MailOutlined style={{ marginRight: 16, color: "#45629bff" }} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <TwitterOutlined  style={{ color: "#45629bff" }}/>
            </a>
          </div>
          <p >Email: <a href="mailto:support@hivechat.com" style={{ color: "#45629bff", textDecoration: "none" }}>support@hivechat.com</a></p>
          <p >Phone: <a href="tel:+911234567890" style={{ color: "#45629bff", textDecoration: "none" }}>+91 12345 67890</a></p>
        </Col>
      </Row>

      <hr style={{ margin: "32px 0", borderColor: "white" }} />

      {/* Partner/Company Logos */}
      <Row justify="center" gutter={24} style={{ marginBottom: 16 }}>
        <img src="https://cdn-icons-png.flaticon.com/128/733/733585.png" height={40} style={{ marginRight: 20 }} />
        <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" height={40} style={{ marginRight: 20 }} />
        <img src="https://cdn-icons-png.flaticon.com/128/733/733553.png" height={40} style={{ marginRight: 20 }} />
        <img src="https://cdn-icons-png.flaticon.com/128/733/733579.png" height={40} style={{ marginRight: 20 }} />
        {/* <img src="https://cdn-icons-png.flaticon.com/128/733/733609.png" height={40} /> */}
      </Row>

      <p style={{ textAlign: "center", color: "#45629bff", fontSize: "14px" }}>
        © {new Date().getFullYear()} HiveChat. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
