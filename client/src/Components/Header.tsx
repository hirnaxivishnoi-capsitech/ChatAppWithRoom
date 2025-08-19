import { LoginOutlined } from "@ant-design/icons";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { token } from "../store/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const isAuthenticated = useSelector(token) ? true : false;

  return (
    <div className="d-flex p-8" style={{ backgroundColor: "#E8F0F8" }}>
      <div className="d-flex d-center">
        <img src="/HiveChatLogo.png" alt="Logo" width={41.8} />
        <div
          className="fs-24"
          style={{
            fontWeight: 800,
            background: "linear-gradient(40deg, #8e45abff, #6AC4FA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Poppins",
          }}
        >
          HiveChat
        </div>
      </div>

      {pathname !== "/login" && (
        <div>
          <p
            className="btn button1 mx-4"
            style={{ fontWeight: 600 }}
            onClick={() => navigate("/login")}
          >
            {" "}
            Login
            <LoginOutlined className="mx-4" />
          </p>
          {/* <p
            className="btn button1 mx-4"
            style={{ fontWeight: 600 }}
            onClick={() => navigate("/register")}
          >
            {" "}
            Register
          </p> */}
        </div>
      )}
    </div>
  );
};

export default Header;
