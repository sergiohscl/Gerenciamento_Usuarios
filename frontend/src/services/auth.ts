import { api } from "@/services/api";
import type {
  LoginBody,
  LoginResponse   
} from "@/store/auth/authTypes";

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

export async function registerRequest(body: FormData) {
  const { data } = await api.post("/api/v1/auth/register/", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function googleLoginRequest(payload: { token: string }) {
  const { data } = await api.post("/api/v1/auth/google/", payload);
  return data;
}
