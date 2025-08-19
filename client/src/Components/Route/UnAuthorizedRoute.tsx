import React from 'react'
import Login from '../Auth/Login'
import Register from '../Auth/Register'
import LandingPage from '../LandingPage'
import { useSelector } from 'react-redux'
import { token } from '../../store/authSlice'
import { Routes,Route } from 'react-router-dom'

const UnAuthorizedRoute = () => {
    const selector = useSelector(token);
    const isAuthenticated = selector ? true : false;
    const routeConfig = [
        {
            path:'/landing',
            element:<LandingPage/>,
            condition : !isAuthenticated
        },
        {
            path:'/login',
            element:<Login/>,
            condition :  !isAuthenticated
        },
        {
            path:'/register',
            element:<Register/>,
            condition :  !isAuthenticated
        },
        {
            path:'/*',
            element:<LandingPage/>,
            condition :  !isAuthenticated
        },

    ]   

  return (
    <div>
        <Routes>
            {routeConfig?.map((route, index) => (
                route?.condition && (
                    <Route key={index} path={route?.path} element={route?.element} />
                )
            ))}
        </Routes>
    </div>
  )
}

export default UnAuthorizedRoute