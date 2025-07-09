import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = `${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.details) {
        errorMessage = `خطأ في البيانات المدخلة`;
      }
    } catch {
      const text = (await res.text()) || res.statusText;
      errorMessage = `${res.status}: ${text}`;
    }
    throw new Error(errorMessage);
  }
}

export async function apiRequest(
  url: string,
  options: RequestInit = {},
): Promise<any> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
