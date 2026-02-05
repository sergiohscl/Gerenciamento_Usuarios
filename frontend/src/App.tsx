import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginSuccess, logout } from "@/store/auth/authSlice";
import { loginRequest, logoutRequest, meRequest } from "@/services/auth";

export default function App() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("admin123");

  const handleLogin = async () => {
    const data = await loginRequest({ email, password });
    dispatch(loginSuccess({ user: data.user, tokens: data.tokens }));
  };

  const handleMe = async () => {
    const data = await meRequest();
    alert(JSON.stringify(data, null, 2));
  };

  const handleLogout = async () => {
    const refresh = auth.tokens?.refresh;
    if (refresh) {
      await logoutRequest(refresh);
    }
    dispatch(logout());
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Frontend JWT</h1>

      {!auth.isAuthenticated ? (
        <div style={{ display: "grid", gap: 8, maxWidth: 320 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="senha" type="password" />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          <div>Logado como: {auth.user?.email}</div>
          <button onClick={handleMe}>Me</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
