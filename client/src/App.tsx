import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { ConfigProvider } from "antd";
import { useSelector } from "react-redux";
import { token } from "./store/authSlice";
// import NotFound from "./Components/NotFound";
import AuthorizedRoutes from "./Components/Route/AuthorizedRoutes";
import UnAuthorizedRoute from "./Components/Route/UnAuthorizedRoute";
import enUS from "antd/es/locale/en_US";
function App() {
  const isAuthenticated = useSelector(token) ? true : false;
  return (
    
    <ConfigProvider locale={enUS}
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
        },
      }}
    >
       <BrowserRouter>
      {isAuthenticated ? <AuthorizedRoutes /> : <UnAuthorizedRoute />}
    </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
