import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export default function AuthCard({
  title,
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow">
      <h1 className="mb-6 text-center text-3xl font-bold">
        {title}
      </h1>

      {children}
    </div>
  );
}