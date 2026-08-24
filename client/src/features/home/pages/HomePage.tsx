import { useState } from "react";
import { useParams } from "react-router-dom";
import { SubmitRequestModal } from "@/features/public/components/SubmitRequestModal";
import HeroBlock from "@/components/blocks/hero-2";
import HeaderBlock from "@/components/blocks/header-4";

export default function HomePage() {
  const { organizationSlug } = useParams<{ organizationSlug?: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <HeaderBlock />

      {/* Hero Section */}
      <main className="flex-1">
        <HeroBlock onSubmitRequest={() => setIsModalOpen(true)} />
      </main>

      {/* Modal */}
      <SubmitRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        organizationSlug={organizationSlug || ""}
      />
    </div>
  );
}