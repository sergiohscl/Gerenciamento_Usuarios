import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type UserItem = {
  id: number;
  username: string;
  email: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    setError(null);
    try {
      const { data } = await api.get<UserItem[]>("/api/v1/admin/users/");
      setUsers(data);
    } catch (e: any) {
      if (e?.response?.status === 403) {
        toast.error("Acesso negado (apenas superusuário).");
        setError("Acesso negado: apenas superusuário pode ver esta página.");
      } else {
        toast.error("Erro ao carregar usuários.");
        setError("Erro ao carregar usuários.");
      }
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    try {
      await api.delete(`/api/v1/admin/users/${id}/`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Usuário deletado!");
    } catch (e: any) {
      if (e?.response?.status === 403) {
        toast.error("Acesso negado.");
        setError("Acesso negado.");
      } else {
        toast.error("Não foi possível deletar.");
        setError("Não foi possível deletar.");
      }
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-3xl grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Admin - Usuários</CardTitle>
            <Button variant="outline" asChild>
              <Link to="/me">Voltar</Link>
            </Button>
          </CardHeader>

          <CardContent className="grid gap-3">
            {error && <p className="text-sm text-red-500">{error}</p>}

            {users.length === 0 && !error ? (
              <p>Carregando...</p>
            ) : (
              <div className="grid gap-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="grid">
                      <span className="font-medium">{u.username}</span>
                      <span className="text-sm text-muted-foreground">{u.email}</span>
                    </div>

                    <Button variant="destructive" onClick={() => handleDelete(u.id)} className="cursor-pointer">
                      Deletar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
