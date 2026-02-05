import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Acesso negado</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/me">Voltar</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Ir para login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
