import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "@/services/auth";
import { useAppDispatch } from "@/store/hooks";
import { loginSuccess } from "@/store/auth/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginRequest({ email, password });
      dispatch(loginSuccess({ user: data.user, tokens: data.tokens }));
      navigate("/me");
    } catch (e) {
      setError("Credenciais inválidas ou erro no servidor.");
      toast.error("Falha no login. Verifique email e senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-8 pt-38 flex justify-center items-start">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button onClick={handleLogin} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
