import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { meRequest, logoutRequest } from "@/services/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/auth/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { toast } from "sonner";

type MeData = {
  id: number;
  username: string;
  email: string;
  avatar?: string | null;
};

export default function MePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const refresh = useAppSelector((s) => s.auth.tokens?.refresh);

  const [me, setMe] = useState<MeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      if (refresh) await logoutRequest(refresh);
      toast.success("Logout realizado!");
    } catch {
      toast.warning("Logout local realizado.");
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await meRequest();
        setMe(data);
      } catch {
        setError("Erro ao carregar seus dados.");
        toast.error("Erro ao carregar seu perfil.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const avatarUrl = me?.avatar
    ? me.avatar.startsWith("http")
      ? me.avatar
      : `${import.meta.env.VITE_API_URL}${me.avatar}`
    : undefined;

  console.log("Avatar URL:", avatarUrl);

  return (
    <div className="min-h-screen px-8 pt-30 flex justify-center items-start">
      <div className="w-full max-w-2xl grid gap-26">
        <Card className="px-6 py-16">
          <CardHeader className="grid grid-cols-3 items-center">
            {/* Avatar */}
            <div className="flex items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} alt="Avatar" />
                <AvatarFallback className="bg-slate-700">
                  <UserRound className="w-6 h-6 text-slate-200" />
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Título centralizado */}
            <CardTitle className="text-center">Meu Perfil</CardTitle>

            {/* Ações */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link to="/admin/users">Admin: Usuários</Link>
              </Button>
              <Button onClick={handleLogout}>Sair</Button>
            </div>
          </CardHeader>

          <CardContent>
            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

            {loading ? (
              <p>Carregando...</p>
            ) : me ? (
              <div className="grid gap-2">
                <div>
                  <b>ID:</b> {me.id}
                </div>
                <div>
                  <b>Username:</b> {me.username}
                </div>
                <div>
                  <b>Email:</b> {me.email}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sem dados.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
