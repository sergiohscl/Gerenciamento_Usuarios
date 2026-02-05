import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import MePage from "@/pages/MePage";
import AdminUsersPage from "@/pages/ListUsersPage";
import { PrivateRoute } from "./PrivateRoute";
import { AdminRoute } from "./AdminRoute";
import ForbiddenPage from "@/pages/ForbiddenPage";
import RegisterPage from "@/pages/RegisterPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/me" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/me"
          element={
            <PrivateRoute>
              <MePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />

         <Route
          path="/auth/register"
          element={
            <AdminRoute>
              <RegisterPage />
            </AdminRoute>
          }
        />

        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route path="*" element={<Navigate to="/me" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
