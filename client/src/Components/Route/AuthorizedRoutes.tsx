import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../Dashboard/MainLayout";

const AuthorizedRoutes = () => {
  return (
    <Routes>
      <Route path="/hivechat" element={<MainLayout />} />
      <Route path="*" element={<Navigate to="/hivechat" />} />
    </Routes>
  );
};

export default AuthorizedRoutes;
