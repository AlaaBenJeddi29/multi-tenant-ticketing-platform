import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { SubmitRequestModal } from "@/features/public/components/SubmitRequestModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { organizationSlug } = useParams<{ organizationSlug?: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (!organizationSlug) {
      // Modal will show error when opened without slug
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Ticketing Platform</h1>
          <p className="text-sm text-muted-foreground">Fast, organized support for your team.</p>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-5xl font-bold text-foreground">Need Help?</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Submit your request and our team will get back to you shortly.
          </p>
          
          <Card className="mt-8 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Get Started</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleOpenModal}
                className="w-full"
                size="lg"
              >
                <Plus className="mr-2 size-5" />
                Submit a Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card px-6 py-4">
        <div className="mx-auto text-center text-sm text-muted-foreground">
          Powered by Ticketing Platform
        </div>
      </footer>

      {/* Modal */}
      <SubmitRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        organizationSlug={organizationSlug || ""}
      />
    </div>
  );
}