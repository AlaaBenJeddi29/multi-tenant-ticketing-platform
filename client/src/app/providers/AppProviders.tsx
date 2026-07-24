import type { ReactNode } from "react";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}