import { useEffect, useState } from "react";
import { meRequest } from "@/services/auth";
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/components/app-layout";

type MeData = {
  id: number;
  username: string;
  email: string;
  avatar?: string | null;
};

export default function MePage() {
  
  const [me, setMe] = useState<MeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <AppLayout>
      <div className="min-h-screen px-8 pt-16 flex justify-center items-start ">
        <Card className="px-12 py-10 bg-slate-900 border border-slate-800 rounded-xl ">
          <CardTitle className="text-center text-white mb-6">
            Meu Perfil
          </CardTitle>

          <div className="flex items-center gap-12">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarImage src={avatarUrl} alt="Avatar" />
              <AvatarFallback className="bg-slate-700">
                <UserRound className="w-6 h-6 text-slate-200" />
              </AvatarFallback>
            </Avatar>

            <div className="grid gap-2 text-white">
              {error && <p className="text-sm text-red-400">{error}</p>}

              {loading ? (
                <p className="text-slate-400">Carregando...</p>
              ) : me ? (
                <>
                  <div>
                    <span className="font-semibold">ID:</span> {me.id}
                  </div>
                  <div>
                    <span className="font-semibold">Nome:</span>{" "}
                    {me.username}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {me.email}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400">Sem dados.</p>
              )}
            </div>
          </div>
        </Card>        
      </div>
    </AppLayout>
  );
}
