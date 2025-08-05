import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ConfigProvider } from 'antd'
import LandingPage from './Components/LandingPage';
import NotFound from './Components/NotFound';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';

function App() {

  return (
     <ConfigProvider theme={{
          components: {
            Card: {
              // colorBgContainer:' #D3D3D3',
              // headerBg:'#F2F2FD',
              // colorTextHeading:'white'
            },
            Button: {
              colorPrimaryHover: 'rgb(119, 119, 246)',
              borderRadiusLG: 10,
              borderRadiusSM: 10,
            },
            Table: {
              // colorBgContainer:' #D3D3D3',
              paddingXS: 10,
              paddingSM: 10,
              headerBg: "#053863",
              headerColor:'white',
              cellPaddingBlock:8
            }
          },
    }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/Register" element={<Register/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
    </ConfigProvider>
  )
}

export default App;