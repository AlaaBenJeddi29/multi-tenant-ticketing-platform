import type { ReactNode } from "react";
import BrandPanel from "./BrandPanel";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left branding section */}
      <section className="relative hidden lg:flex bg-primary">
        <BrandPanel />
      </section>

      {/* Right authentication section */}
      <section className="flex items-center justify-center p-6 sm:p-10">
        {/* ADD THIS WRAPPER DIV WITH max-w-sm w-full */}
        <div className="w-full max-w-sm">
          {children}
        </div>
      </section>

    </div>
  );
}