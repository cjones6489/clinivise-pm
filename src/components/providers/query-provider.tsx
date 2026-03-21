"use client";

import { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { orgId } = useAuth();
  const previousOrgId = useRef(orgId);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  // Clear entire cache when org switches to prevent cross-tenant data leakage
  useEffect(() => {
    if (previousOrgId.current && orgId !== previousOrgId.current) {
      queryClient.clear();
    }
    previousOrgId.current = orgId;
  }, [orgId, queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
