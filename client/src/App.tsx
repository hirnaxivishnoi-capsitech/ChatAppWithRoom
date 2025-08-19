import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ConfigProvider } from "antd";
import LandingPage from "./Components/LandingPage";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import MainLayout from "./Components/Dashboard/MainLayout";
import { useSelector } from "react-redux";
import { token } from "./store/authSlice";
import NotFound from "./Components/NotFound";
import AuthorizedRoutes from "./Components/Route/AuthorizedRoutes";
import UnAuthorizedRoute from "./Components/Route/UnAuthorizedRoute";

function App() {
  const isAuthenticated = useSelector(token) ? true : false;

  // Route Config
  const routeConfig = [
    {
      path: "/landing",
      element: <LandingPage />,
      condition: !isAuthenticated,
    },
    {
      path: "/login",
      element: <Login />,
      condition: !isAuthenticated,
    },
    {
      path: "/register",
      element: <Register />,
      condition: !isAuthenticated,
    },
    {
      path: "/hivechat",
      element: <MainLayout />,
      condition: isAuthenticated,
    },
    {
      path: "*",
      element: isAuthenticated ? <Navigate to="/hivechat" />  : <LandingPage/>,
      condition: true, 
    },
    
  ];
  return (
    
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimaryHover: "#457B9D",
            borderRadiusLG: 10,
            borderRadiusSM: 10,
            colorPrimary:'#E9F0F8',
            primaryColor:'black',
            colorPrimaryActive:'#457B9D',
            defaultHoverBorderColor:"#457B9D"
          },
          Modal:{
            // colorBgMask:'rgba(0, 0, 0, 0.45)'
          }
        },
      }}
    >
       <BrowserRouter>
      {isAuthenticated ? <AuthorizedRoutes /> : <UnAuthorizedRoute />}
    </BrowserRouter>
      {/* <BrowserRouter>
        <Routes>
         
          {routeConfig.map(
            (route, index) =>
              route.condition && (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              )
          )}

        

        </Routes>
      </BrowserRouter> */}

        {/* {isAuthenticated ? (
            <>
            <Route path="/hivechat" element={<MainLayout />} />
              <Route path="*" element={<Navigate to='/hivechat' />} />
              <Route path="/" element={<LandingPage />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="*" element={<LandingPage />} />
            </>
          )} */}
    </ConfigProvider>
  );
}

export default App;
