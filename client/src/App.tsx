import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ConfigProvider } from "antd";
import LandingPage from "./Components/LandingPage";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import MainLayout from "./Components/Dashboard/MainLayout";
import { useSelector } from "react-redux";
import { token } from "./store/authSlice";

function App() {
  const isAuthenticated = useSelector(token);
  return (
    
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimaryHover: "rgb(119, 119, 246)",
            borderRadiusLG: 10,
            borderRadiusSM: 10,
          },
          Modal:{
            // colorBgMask:'rgba(0, 0, 0, 0.45)'
          }
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          {isAuthenticated ? (
            <>
            <Route path="/ryzo" element={<MainLayout />} />
              <Route path="*" element={<Navigate to='/ryzo' />} />
              <Route path="/" element={<LandingPage />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="*" element={<LandingPage />} />
            </>
          )}

        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
