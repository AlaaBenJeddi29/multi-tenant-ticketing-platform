import { useState } from "react";
import { User, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { ProfileSection } from "../components/ProfileSection";
import { SecuritySection } from "../components/SecuritySection";

type Tab = "profile" | "security";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-border">
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          onClick={() => setActiveTab("profile")}
          className="gap-2"
        >
          <User className="size-4" />
          Profile
        </Button>
        <Button
          variant={activeTab === "security" ? "default" : "ghost"}
          onClick={() => setActiveTab("security")}
          className="gap-2"
        >
          <Shield className="size-4" />
          Security
        </Button>
      </div>

      {/* Tab Content */}
      <Card className="p-6">
        {activeTab === "profile" && <ProfileSection />}
        {activeTab === "security" && <SecuritySection />}
      </Card>
    </div>
  );
}
