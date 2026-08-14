import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/app/router/routes";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <ShieldAlert className="size-16 text-destructive" />
        </div>
        <h1 className="text-5xl font-bold mb-4">403</h1>
        <p className="text-xl text-muted-foreground mb-6">
          You don't have access to this page.
        </p>
        <Button asChild>
          <Link to={ROUTES.DASHBOARD}>Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
