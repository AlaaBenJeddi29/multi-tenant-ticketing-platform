import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Settings className="size-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Settings</h1>
      <p className="text-sm text-muted-foreground">This section is coming soon.</p>
    </div>
  );
}
