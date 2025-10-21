import { address } from "@/constants/constants";

const BASE_URL = address;
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function request<T = unknown>(
  path: string,
  {
    method = "GET",
    body,
    headers,
    credentials = "include",
  }: {
    method?: Method;
    body?: unknown;
    headers?: HeadersInit;
    credentials?: RequestCredentials;
  } = {},
  logoutEvent: boolean = true
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && logoutEvent) {
      if (typeof window !== "undefined") {
        // trigger logout
        window.dispatchEvent(new Event("auth:logout"));
      }
    } else { 
      const error: any = new Error(data?.message || "Request failed");
      error.status = res.status;
      error.data = data;
      throw error;
    }
  }

  return data;
}
