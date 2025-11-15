import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../store/store";

export default function ProtectedAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSelector((s: RootState) => s.session);

  if (!session.isAdmin) return <Navigate to="/" replace />;

  return children;
}
