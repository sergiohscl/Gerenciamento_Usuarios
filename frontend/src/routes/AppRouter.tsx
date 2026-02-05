import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import MePage from "@/pages/MePage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import { PrivateRoute } from "./PrivateRoute";
import { AdminRoute } from "./AdminRoute";
import ForbiddenPage from "@/pages/ForbiddenPage";

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

        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route path="*" element={<Navigate to="/me" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
