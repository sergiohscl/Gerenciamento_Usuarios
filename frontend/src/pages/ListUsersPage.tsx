import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2, UserRound } from "lucide-react";
import { api } from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import type { PaginatedResponse } from "@/store/auth/authTypes";

type UserItem = {
  id: number;
  username: string;
  email: string;
  avatar?: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [count, setCount] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const API_BASE = useMemo(() => {
    return (
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      "http://localhost:8000"
    );
  }, []);

  function getAvatarUrl(user: UserItem) {
    if (!user.avatar) return undefined;
    if (user.avatar.startsWith("http")) return user.avatar;

    const path = user.avatar.startsWith("/") ? user.avatar : `/${user.avatar}`;
    return `${API_BASE}${path}`;
  }

  async function loadUsers(pageNum = 1) {
    try {
      setIsLoading(true);

      const offset = (pageNum - 1) * pageSize;
      const { data } = await api.get<PaginatedResponse<UserItem>>(
        `/api/v1/admin/users/?limit=${pageSize}&offset=${offset}`
      );

      setUsers(data.results);
      setCount(data.count);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
      setPage(pageNum);
    } catch (e: any) {
      if (e?.response?.status === 403) {
        toast.error("Acesso negado", {
          description: "Apenas superusuário pode ver esta página.",
        });
      } else {
        toast.error("Erro ao carregar usuários.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const ok = window.confirm("Tem certeza que deseja remover este usuário?");
    if (!ok) return;

    try {
      setDeletingId(id);
      await api.delete(`/api/v1/admin/users/${id}/`);
      toast.success("Usuário removido com sucesso.");

      // ✅ recarrega a página atual (e ajusta caso fique vazia)
      // Se deletou o último item da página, tenta voltar uma página
      const willBeEmptyAfterDelete = users.length === 1 && page > 1;
      const nextPage = willBeEmptyAfterDelete ? page - 1 : page;

      await loadUsers(nextPage);
    } catch (e: any) {
      if (e?.response?.status === 403) {
        toast.error("Acesso negado.");
      } else {
        toast.error("Não foi possível deletar.");
      }
    } finally {
      setDeletingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  useEffect(() => {
    loadUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout>
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto w-full space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Usuários</h1>
            <p className="text-sm text-slate-400">
              Lista de usuários cadastrados no sistema.
            </p>
          </div>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-900/80">
                <TableHead className="w-18 text-slate-200 font-semibold">
                  Avatar
                </TableHead>
                <TableHead className="text-slate-200 font-semibold">
                  Nome
                </TableHead>
                <TableHead className="text-slate-200 font-semibold">
                  Email
                </TableHead>
                <TableHead className="w-20 text-center text-slate-200 font-semibold">
                  ID
                </TableHead>
                <TableHead className="w-32 text-right text-slate-200 font-semibold">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-slate-400"
                  >
                    Carregando usuários...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-slate-400"
                  >
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                users.map((user) => {
                  const avatarUrl = getAvatarUrl(user);

                  return (
                    <TableRow key={user.id} className="border-slate-800">
                      <TableCell>
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={avatarUrl} alt={user.username} />
                          <AvatarFallback className="bg-slate-700">
                            <UserRound className="w-4 h-4 text-slate-200" />
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>

                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>

                      <TableCell>{user.email}</TableCell>

                      <TableCell className="text-center text-slate-400">
                        {user.id}
                      </TableCell>

                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          disabled={deletingId === user.id}
                          className="inline-flex items-center justify-center rounded-md border border-slate-700 px-2 py-1 text-xs text-red-400 hover:bg-red-950 hover:text-red-300 disabled:opacity-60 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {deletingId === user.id ? "Removendo..." : "Remover"}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {!isLoading && count > 0 && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-800">
              <p className="text-sm text-slate-400">
                Total: <b className="text-slate-200">{count}</b> • Página{" "}
                <b className="text-slate-200">{page}</b> de{" "}
                <b className="text-slate-200">{totalPages}</b>
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
                  onClick={() => loadUsers(page - 1)}
                  disabled={!prevUrl || page <= 1}
                >
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
                  onClick={() => loadUsers(page + 1)}
                  disabled={!nextUrl || page >= totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}
