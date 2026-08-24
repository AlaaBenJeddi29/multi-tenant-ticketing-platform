import type { ReactNode } from "react";
import BrandPanel from "./BrandPanel";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left branding section - 50% width, hidden on mobile/tablet */}
      <section className="relative hidden lg:flex bg-primary/10 overflow-hidden">
        <BrandPanel />
      </section>

      {/* Right authentication section - full width on mobile, 50% on desktop */}
      <section className="flex items-center justify-center bg-background p-4 sm:p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-md">
          {children}
        </div>
      </section>
    </div>
  );
}