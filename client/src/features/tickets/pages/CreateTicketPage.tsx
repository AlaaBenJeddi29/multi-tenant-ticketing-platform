import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCreateTicket } from "../hooks/useCreateTicket";
import { TicketForm } from "../components/TicketForm";

import type { TicketFormValues } from "../schemas/ticket.schema";

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const createMutation = useCreateTicket();

  const handleSubmit = async (data: TicketFormValues) => {
    try {
      const ticket = await createMutation.mutateAsync({
        title: data.title,
        description: data.description || undefined,
        priorityId: data.priorityId,
        categoryId: data.categoryId,
        requesterId: data.requesterId,
        assetId: data.assetId || undefined,
        assignedToId: data.assignedToId || undefined,
      });

      // Navigate to the newly created ticket
      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      // Error is handled by React Query
      console.error("Failed to create ticket:", error);
    }
  };

  const handleCancel = () => {
    navigate("/tickets");
  };

  return (
    <div className="container mx-auto max-w-3xl p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/tickets")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Tickets
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Create New Ticket</h1>
        <p className="mt-2 text-muted-foreground">
          Fill in the details below to create a new support ticket
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-border bg-card p-6">
        <TicketForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}
