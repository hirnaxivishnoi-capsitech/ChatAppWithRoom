import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ConfigProvider } from "antd";
import LandingPage from "./Components/LandingPage";
import NotFound from "./Components/NotFound";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import MainLayout from "./Components/Dashboard/MainLayout";
import { useSelector } from "react-redux";
import { token } from "./store/authSlice";
import ChatComponent from "./Components/ChatComponents/ChatCompent";

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
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          {isAuthenticated ? (
            <>
            <Route path="/ryzo/*" element={<MainLayout />} />
            <Route path="/chatHub" element={<ChatComponent />} />
            </>
          ) : (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
            </>
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
