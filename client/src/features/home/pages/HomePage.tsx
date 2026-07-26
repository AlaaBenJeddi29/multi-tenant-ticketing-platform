import { useAuth } from "@/features/auth/context/AuthContext";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        Home
      </h1>

      <p className="mt-5">
        Authenticated:

        {" "}

        {isAuthenticated ? "Yes" : "No"}
      </p>

      <pre className="mt-6 rounded bg-black p-5 text-green-400">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}