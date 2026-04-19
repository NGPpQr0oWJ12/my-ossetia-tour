import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "../lib/api";

export default function AdminRouteGuard() {
  const token = authStorage.getToken();
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
