import type { AuthRequest, AuthResponse } from "../types/auth.types";
import { api } from "./axios";

export const register = (data: AuthRequest) => api.post<AuthResponse>("/auth/register", data);

export const login = (data: AuthRequest) => api.post<AuthResponse>("/auth/login", data);

export const getMe = () => api.get<{ id: string }>("/auth/me");

export const logout = () => api.post<void>("/auth/logout");
