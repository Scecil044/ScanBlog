import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/login" />;
}
