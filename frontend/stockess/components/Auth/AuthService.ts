import { request } from "@/utils/api";

export const checkSession = () => request<boolean>("/user/me");

export const loginUser = (email: string, password: string) => 
    request<{ message: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
    }, false);

export const registerUser = (email: string, password: string) =>
    request<{ message: string }>("/auth/register", {
        method: "POST",
        body: { email, password },
    }, false);

export const logout = async () => {
    try {
        await request("/auth/logout", { method: "POST" }, false)
    } catch (error: any) {}
}