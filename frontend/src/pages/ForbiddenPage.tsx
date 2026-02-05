import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen px-8 pt-46 flex justify-center items-start">
      <Card className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl ">
        <CardHeader className="text-slate-200">
          <CardTitle>Acesso negado</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="text-slate-500">
              <Link to="/me">Voltar</Link>
            </Button>
            <Button asChild className="text-slate-200">
              <Link to="/login">Ir para login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
