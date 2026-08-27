import { Separator } from "@/components/ui/separator";

import { ChangePasswordForm } from "./ChangePasswordForm";
import { ActiveSessions } from "./ActiveSessions";

export function SecuritySection() {
  return (
    <div className="space-y-8">
      <ChangePasswordForm />
      <Separator />
      <ActiveSessions />
    </div>
  );
}
