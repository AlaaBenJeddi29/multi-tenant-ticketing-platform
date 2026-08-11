import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { ticketFormSchema, type TicketFormValues } from "../schemas/ticket.schema";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { usePriorities } from "@/features/priorities/hooks/usePriorities";
import { useRequesters, useAssets } from "@/features/requesters/hooks/useRequesters";
import { useUsersList } from "@/features/users/hooks/useUsersList";

import type { Ticket } from "../types/ticket.types";

interface TicketFormProps {
  ticket?: Ticket | null;
  onSubmit: (data: TicketFormValues) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}

export function TicketForm({
  ticket,
  onSubmit,
  onCancel,
  isSubmitting,
}: TicketFormProps) {
  const isEditMode = !!ticket;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priorityId: "",
      categoryId: "",
      requesterId: "",
      assetId: "",
      assignedToId: "",
    },
  });

  // Watch form values for controlled selects
  const priorityId = watch("priorityId");
  const categoryId = watch("categoryId");
  const requesterId = watch("requesterId");
  const assetId = watch("assetId");
  const assignedToId = watch("assignedToId");

  // Fetch dropdown options
  const { data: categoriesData } = useCategories({
    page: 1,
    pageSize: 100,
    sortBy: "name",
    sortOrder: "asc",
    isActive: true,
  });

  const { data: prioritiesData } = usePriorities({ isActive: true });

  const { data: requestersData } = useRequesters({ isActive: true });

  const { data: assetsData } = useAssets({ status: "ACTIVE" });

  const { data: usersData } = useUsersList({
    page: 1,
    pageSize: 100,
    sortBy: "lastName",
    sortOrder: "asc",
    isActive: true,
  });

  // Prefill form in edit mode
  useEffect(() => {
    if (ticket) {
      reset({
        title: ticket.title,
        description: ticket.description || "",
        priorityId: ticket.priority.id,
        categoryId: ticket.category.id,
        requesterId: ticket.requester.id,
        assetId: ticket.asset?.id || "",
        assignedToId: ticket.assignedTo?.id || "",
      });
    }
  }, [ticket, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <Field>
        <FieldLabel htmlFor="title">
          Title <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="title"
          placeholder="Brief description of the issue"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        <FieldError errors={[errors.title]} />
      </Field>

      {/* Description */}
      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <textarea
          id="description"
          placeholder="Detailed description of the issue"
          rows={4}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        <FieldError errors={[errors.description]} />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Priority */}
        <Field>
          <FieldLabel htmlFor="priorityId">
            Priority <span className="text-destructive">*</span>
          </FieldLabel>
          <Select
            value={priorityId}
            onValueChange={(value) => setValue("priorityId", value)}
          >
            <SelectTrigger id="priorityId" aria-invalid={!!errors.priorityId}>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {prioritiesData?.data.map((priority) => (
                <SelectItem key={priority.id} value={priority.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: priority.color }}
                    />
                    {priority.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.priorityId]} />
        </Field>

        {/* Category */}
        <Field>
          <FieldLabel htmlFor="categoryId">
            Category <span className="text-destructive">*</span>
          </FieldLabel>
          <Select
            value={categoryId}
            onValueChange={(value) => setValue("categoryId", value)}
          >
            <SelectTrigger id="categoryId" aria-invalid={!!errors.categoryId}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesData?.data.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.categoryId]} />
        </Field>

        {/* Requester */}
        <Field>
          <FieldLabel htmlFor="requesterId">
            Requester <span className="text-destructive">*</span>
          </FieldLabel>
          <Select
            value={requesterId}
            onValueChange={(value) => setValue("requesterId", value)}
          >
            <SelectTrigger id="requesterId" aria-invalid={!!errors.requesterId}>
              <SelectValue placeholder="Select requester" />
            </SelectTrigger>
            <SelectContent>
              {requestersData?.data.map((requester) => (
                <SelectItem key={requester.id} value={requester.id}>
                  {requester.firstName} {requester.lastName}
                  {requester.company && ` (${requester.company})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.requesterId]} />
        </Field>

        {/* Asset (Optional) */}
        <Field>
          <FieldLabel htmlFor="assetId">Asset</FieldLabel>
          <Select
            value={assetId}
            onValueChange={(value) => setValue("assetId", value)}
          >
            <SelectTrigger id="assetId">
              <SelectValue placeholder="Select asset (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {assetsData?.data.map((asset) => (
                <SelectItem key={asset.id} value={asset.id}>
                  {asset.name} ({asset.assetTag})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.assetId]} />
        </Field>

        {/* Assignee (Optional) */}
        <Field>
          <FieldLabel htmlFor="assignedToId">Assign To</FieldLabel>
          <Select
            value={assignedToId}
            onValueChange={(value) => setValue("assignedToId", value)}
          >
            <SelectTrigger id="assignedToId">
              <SelectValue placeholder="Assign to user (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned</SelectItem>
              {usersData?.data.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.assignedToId]} />
        </Field>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Ticket"
              : "Create Ticket"}
        </Button>
      </div>
    </form>
  );
}
