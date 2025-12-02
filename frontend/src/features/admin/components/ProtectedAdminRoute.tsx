import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";

export default function ProtectedAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useAppSelector((s) => s.session);

  if (!session.isAdmin) return <Navigate to="/" replace />;

  return children;
}
