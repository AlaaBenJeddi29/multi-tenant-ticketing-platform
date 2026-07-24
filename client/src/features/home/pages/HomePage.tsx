import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router/routes";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">

      <h1 className="text-5xl font-bold">
        Multi-Tenant Ticketing Platform
      </h1>

      <Link
        to={ROUTES.LOGIN}
        className="rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Login
      </Link>

    </div>
  );
}