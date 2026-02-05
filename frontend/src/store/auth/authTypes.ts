export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string | null;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
}
