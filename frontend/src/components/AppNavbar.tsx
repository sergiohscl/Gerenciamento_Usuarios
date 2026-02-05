import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/store/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import logo from "@/assets/genciaUsuario.png";

export default function AppNavbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="w-full border-b border-white/10 bg-black/40 backdrop-blur text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/me" className="flex items-center gap-2">
            <img src={logo} alt="GerUsers" className="h-12 w-12" />
          </Link>

          <nav className="flex gap-4 text-sm">
            <Link to="/me" className="hover:underline">
              Perfil Usuário
            </Link>
            <Link to="/admin/users" className="hover:underline">
              Área Admin
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleLogout} className="cursor-pointer">Sair</Button>
        </div>
      </div>
    </header>
  );
}
