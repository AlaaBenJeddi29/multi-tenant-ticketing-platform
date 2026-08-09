import type { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/react-query";

import { AuthProvider } from "@/features/auth/context/AuthContext";

type Props = {
  children: ReactNode;
};

export default function AppProviders({
  children,
}: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}