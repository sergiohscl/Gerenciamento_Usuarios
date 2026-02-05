import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

type Props = {
  children: React.ReactNode;
};

export function PrivateRoute({ children }: Props) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
