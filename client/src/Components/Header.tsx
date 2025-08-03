import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  
  return (
    <div className="d-flex p-8" style={{backgroundColor:'#fff'}}>
      <div className="d-flex d-center">
        <img src="Logo.png" alt="Logo" width={40}/>
        {/* <img src="https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-298c-622f-80fc-e183d938a595/raw?se=2025-08-03T13%3A15%3A55Z&sp=r&sv=2024-08-04&sr=b&scid=80e7817c-8ffa-56cd-ae3c-3a864c544459&skoid=add8ee7d-5fc7-451e-b06e-a82b2276cf62&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-02T19%3A38%3A33Z&ske=2025-08-03T19%3A38%3A33Z&sks=b&skv=2024-08-04&sig=0r5CR/CcOaXNmj7tP2NNkkgr8uoBN6wj6n0vY5slooE%3D" alt="Logo"  width={40}/> */}
        <div className="fs-24" style={{color:'#2D1A5B',fontWeight:800}}>Ryzo</div>
      </div>
  
      {path === "/" && (
        <div>
        <p
          className="btn button1 mx-4"
          style={{ fontWeight: 600 }}
          onClick={() => navigate("/login")}
        >
          {" "}
          Login <LoginOutlined className="mx-4" />
        </p>
          <p
          className="btn button1 mx-4"
          style={{ fontWeight: 600 }}
          onClick={() => navigate("/register")}
        >
          {" "}
          Register <UserAddOutlined className="mx-4" />
        </p>
        </div>
      )}
  
    </div>
  );
};

export default Header;
