import { api } from "@/services/api";

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    avatar?: string | null;
  };
  tokens: {
    access: string;
    refresh: string;
  };
};

export async function loginRequest(body: LoginBody) {
  const { data } = await api.post<LoginResponse>("/api/v1/auth/login/", body);
  return data;
}

export async function meRequest() {
  const { data } = await api.get("/api/v1/me/");
  return data;
}

export async function logoutRequest(refresh: string) {
  const { data } = await api.post("/api/v1/auth/logout/", { refresh });
  return data;
}
