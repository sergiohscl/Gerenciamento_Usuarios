import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerRequest } from "@/services/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/components/app-layout";

const MAX_AVATAR_MB = 2;
const MAX_AVATAR_BYTES = MAX_AVATAR_MB * 1024 * 1024;

const registerSchema = z
  .object({
    username: z.string().min(3, "Informe um username (mín. 3 caracteres)"),
    email: z.string().email("Informe um e-mail válido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    password2: z.string().min(6, "Confirme a senha"),
    avatar: z.any().optional(),
  })
  .refine((data) => data.password === data.password2, {
    path: ["password2"],
    message: "As senhas não conferem",
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password2: "",
      avatar: undefined,
    },
  });

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setValue("avatar", undefined);
      setAvatarPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem (PNG/JPG).");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      toast.error(`O avatar deve ter no máximo ${MAX_AVATAR_MB}MB.`);
      e.target.value = "";
      return;
    }

    setValue("avatar", file, { shouldValidate: true });

    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  async function onSubmit(values: RegisterForm) {
    try {
      const form = new FormData();
      form.append("username", values.username.trim());
      form.append("email", values.email.trim());
      form.append("password", values.password);
      form.append("password2", values.password2);

      if (values.avatar instanceof File) {
        form.append("avatar", values.avatar);
      }

      await registerRequest(form);

      toast.success("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Não foi possível cadastrar. Tente novamente.";

      toast.error("Erro no cadastro", { description: String(detail) });
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen px-8 pt-16 flex justify-center items-start">
        <Card className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl text-slate-200">
          <CardHeader>
            <CardTitle className="text-center">Registrar Usuário</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Preview do avatar" />
                  ) : (
                    <AvatarFallback className="bg-slate-200">
                      <UserRound className="w-6 h-6 text-slate-500" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 space-y-1">
                  <Label htmlFor="avatar">Avatar (opcional)</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isSubmitting}
                    className="file:bg-slate-500 cursor-pointer"
                  />
                  <p className="text-xs text-slate-500">
                    PNG ou JPG, de preferência até {MAX_AVATAR_MB}MB.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="seu_username"
                  disabled={isSubmitting}
                  {...register("username")}
                />
                {errors.username?.message && (
                  <p className="text-xs text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  disabled={isSubmitting}
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha"
                  disabled={isSubmitting}
                  {...register("password")}
                />
                {errors.password?.message && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password2">Confirme a senha</Label>
                <Input
                  id="password2"
                  type="password"
                  placeholder="Repita a senha"
                  disabled={isSubmitting}
                  {...register("password2")}
                />
                {errors.password2?.message && (
                  <p className="text-xs text-red-500">
                    {errors.password2.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
