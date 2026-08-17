import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

import { requesterFormSchema, type RequesterFormValues } from "../schemas/requester.schema";
import { useCreateRequester } from "../hooks/useCreateRequester";
import { useUpdateRequester } from "../hooks/useUpdateRequester";

import type { Requester } from "../types/requester.types";

interface RequesterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requester?: Requester | null;
}

export function RequesterFormDialog({
  open,
  onOpenChange,
  requester,
}: RequesterFormDialogProps) {
  const isEditMode = !!requester;

  const createMutation = useCreateRequester();
  const updateMutation = useUpdateRequester();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RequesterFormValues>({
    resolver: zodResolver(requesterFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    },
  });

  // Reset form when dialog opens or requester changes
  useEffect(() => {
    if (open) {
      if (requester) {
        reset({
          firstName: requester.firstName,
          lastName: requester.lastName,
          email: requester.email,
          phone: requester.phone || "",
          company: requester.company || "",
          notes: requester.notes || "",
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          notes: "",
        });
      }
    }
  }, [open, requester, reset]);

  const onSubmit = async (data: RequesterFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: requester.id,
          input: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || undefined,
            company: data.company || undefined,
            notes: data.notes || undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || undefined,
          company: data.company || undefined,
          notes: data.notes || undefined,
        });
      }

      // Close dialog and reset form on success
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error is handled by React Query, just log for debugging
      console.error("Failed to save requester:", error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Requester" : "Create New Requester"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the requester details below."
              : "Add a new requester to manage contact information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name Field */}
          <Field>
            <FieldLabel htmlFor="firstName">
              First Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="firstName"
              placeholder="e.g., John"
              aria-invalid={!!errors.firstName}
              {...register("firstName")}
            />
            <FieldError errors={[errors.firstName]} />
          </Field>

          {/* Last Name Field */}
          <Field>
            <FieldLabel htmlFor="lastName">
              Last Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="lastName"
              placeholder="e.g., Doe"
              aria-invalid={!!errors.lastName}
              {...register("lastName")}
            />
            <FieldError errors={[errors.lastName]} />
          </Field>

          {/* Email Field */}
          <Field>
            <FieldLabel htmlFor="email">
              Email <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="e.g., john.doe@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          {/* Phone Field */}
          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              id="phone"
              placeholder="e.g., +1 555-123-4567"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
            <FieldError errors={[errors.phone]} />
          </Field>

          {/* Company Field */}
          <Field>
            <FieldLabel htmlFor="company">Company</FieldLabel>
            <Input
              id="company"
              placeholder="e.g., Acme Inc."
              aria-invalid={!!errors.company}
              {...register("company")}
            />
            <FieldError errors={[errors.company]} />
          </Field>

          {/* Notes Field */}
          <Field>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <Input
              id="notes"
              placeholder="Additional notes about the requester..."
              aria-invalid={!!errors.notes}
              {...register("notes")}
            />
            <FieldError errors={[errors.notes]} />
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update Requester"
                  : "Create Requester"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
