import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { api } from "@/services/api";

type Props = {
  children: React.ReactNode;
};

export function AdminRoute({ children }: Props) {
  const [allowed, setAllowed] = useState<null | boolean>(null);

  useEffect(() => {
    (async () => {
      try {
        await api.get("/api/v1/admin/users/");
        setAllowed(true);
      } catch (e: any) {
        if (e?.response?.status === 403) {
          setAllowed(false);
        } else {
          setAllowed(false);
        }
      }
    })();
  }, []);

  return (
    <PrivateRoute>
      {allowed === null ? (
        <div className="min-h-screen flex items-center justify-center">
          <p>Verificando permissão...</p>
        </div>
      ) : allowed ? (
        <>{children}</>
      ) : (
        <Navigate to="/forbidden" replace />
      )}
    </PrivateRoute>
  );
}
