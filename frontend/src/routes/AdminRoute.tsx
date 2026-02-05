import { PrivateRoute } from "./PrivateRoute";

type Props = {
  children: React.ReactNode;
};

export function AdminRoute({ children }: Props) {
  
  return <PrivateRoute>{children}</PrivateRoute>;
}
