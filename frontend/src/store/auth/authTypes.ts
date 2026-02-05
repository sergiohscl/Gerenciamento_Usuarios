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
