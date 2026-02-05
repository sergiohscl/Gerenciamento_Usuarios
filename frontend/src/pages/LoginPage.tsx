import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginRequest } from "@/services/auth";
import { useAppDispatch } from "@/store/hooks";
import { loginSuccess } from "@/store/auth/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(3, "Senha obrigatória"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      const data = await loginRequest(values);
      dispatch(loginSuccess({ user: data.user, tokens: data.tokens }));
      toast.success("Login realizado com sucesso!");
      navigate("/me");
    } catch {
      toast.error("Falha no login. Verifique e-mail e senha.");
    }
  };

  return (
    <div className="min-h-screen px-8 pt-38 flex justify-center items-start">
      <Card className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl text-slate-200">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label>E-mail</Label>
              <Input {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Senha</Label>
              <Input type="password" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting} className="cursor-pointer">
              {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
    </div>
  );
}
