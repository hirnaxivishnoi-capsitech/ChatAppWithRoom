// AuthorizedRoutes.js
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../Dashboard/MainLayout";
import Dashboard from "../Dashboard/Dashoboard";

const AuthorizedRoutes = () => {
  return (
    <Routes>
      <Route path="/hivechat" element={<MainLayout />} />
      <Route path="*" element={<Navigate to="/hivechat" />} />
      <Route path="/nikita" element={<Dashboard />} />
    </Routes>
  );
};

export default AuthorizedRoutes;
