import { Activity } from "lucide-react";

export default function AdminSystemHealthPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Activity className="size-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-semibold mb-2">System Health</h1>
      <p className="text-sm text-muted-foreground">This section is coming soon.</p>
    </div>
  );
}
