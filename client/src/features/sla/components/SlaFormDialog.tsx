import { useEffect, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

import { slaFormSchema, type SlaFormValues } from "../schemas/sla.schema";
import { useCreateSla } from "../hooks/useCreateSla";
import { useUpdateSla } from "../hooks/useUpdateSla";
import { usePriorities } from "@/features/priorities/hooks/usePriorities";
import { useToast } from "@/hooks/use-toast";

import type { Sla } from "../types/sla.types";

interface SlaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sla?: Sla | null;
  existingSlas: Sla[];
}

export function SlaFormDialog({
  open,
  onOpenChange,
  sla,
  existingSlas,
}: SlaFormDialogProps) {
  const isEditMode = !!sla;
  const { toast } = useToast();

  const createMutation = useCreateSla();
  const updateMutation = useUpdateSla();

  // Fetch all priorities
  const { data: prioritiesData } = usePriorities({ isActive: true, pageSize: 100 });

  // Filter out priorities that already have SLAs (except the current one in edit mode)
  const availablePriorities = useMemo(() => {
    if (!prioritiesData?.data) return [];

    const usedPriorityIds = new Set(
      existingSlas
        .filter((existingSla) => existingSla.id !== sla?.id)
        .map((existingSla) => existingSla.priority?.id)
    );

    return prioritiesData.data.filter(
      (priority) => !usedPriorityIds.has(priority.id)
    );
  }, [prioritiesData, existingSlas, sla]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<SlaFormValues>({
    resolver: zodResolver(slaFormSchema),
    defaultValues: {
      name: "",
      priorityId: "",
      responseTimeMinutes: 60,
      resolutionTimeMinutes: 480,
    },
  });

  const priorityId = watch("priorityId");

  // Reset form when dialog opens or SLA changes
  useEffect(() => {
    if (open) {
      if (sla) {
        reset({
          name: sla.name,
          priorityId: sla.priority?.id || "",
          responseTimeMinutes: sla.responseTimeMinutes,
          resolutionTimeMinutes: sla.resolutionTimeMinutes,
        });
      } else {
        reset({
          name: "",
          priorityId: "",
          responseTimeMinutes: 60,
          resolutionTimeMinutes: 480,
        });
      }
    }
  }, [open, sla, reset]);

  const onSubmit = async (data: SlaFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: sla.id,
          input: {
            name: data.name,
            responseTimeMinutes: data.responseTimeMinutes,
            resolutionTimeMinutes: data.resolutionTimeMinutes,
          },
        });
      } else {
        if (!data.priorityId) {
          throw new Error("Priority is required");
        }
        await createMutation.mutateAsync({
          name: data.name,
          priorityId: data.priorityId,
          responseTimeMinutes: data.responseTimeMinutes,
          resolutionTimeMinutes: data.resolutionTimeMinutes,
        });
      }

      // Close dialog and reset form on success
      onOpenChange(false);
      reset();
    } catch (error: any) {
      // Surface 409 error cleanly
      if (error?.response?.status === 409) {
        toast({
          title: "SLA Conflict",
          description: "This priority already has an SLA. Another administrator may have created it while you were editing. Please refresh the page.",
          variant: "destructive",
        });
      } else {
        // Error is handled by React Query, just log for debugging
        console.error("Failed to save SLA:", error);
      }
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit SLA" : "Create New SLA"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the SLA settings below."
              : "Configure SLA timelines for a priority level. Each priority can only have one SLA."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <Field>
            <FieldLabel htmlFor="name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="name"
              placeholder="e.g., Critical Priority SLA"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          {/* Priority Field (only in create mode) */}
          {!isEditMode && (
            <Field>
              <FieldLabel htmlFor="priorityId">
                Priority <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={priorityId}
                onValueChange={(value: string) => setValue("priorityId", value)}
              >
                <SelectTrigger id="priorityId" aria-invalid={!!errors.priorityId}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {availablePriorities.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      All priorities already have SLAs
                    </div>
                  ) : (
                    availablePriorities.map((priority) => (
                      <SelectItem key={priority.id} value={priority.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2 rounded-full"
                            style={{ backgroundColor: priority.color }}
                          />
                          {priority.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.priorityId]} />
              {availablePriorities.length === 0 && (
                <Alert className="mt-2">
                  All active priorities already have SLAs configured.
                </Alert>
              )}
            </Field>
          )}

          {/* Response Time Field */}
          <Field>
            <FieldLabel htmlFor="responseTimeMinutes">
              Response Time (minutes) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="responseTimeMinutes"
              type="number"
              min="1"
              max="43200"
              placeholder="e.g., 60"
              aria-invalid={!!errors.responseTimeMinutes}
              {...register("responseTimeMinutes", { valueAsNumber: true })}
            />
            <FieldDescription>
              Time within which the first response must be made
            </FieldDescription>
            <FieldError errors={[errors.responseTimeMinutes]} />
          </Field>

          {/* Resolution Time Field */}
          <Field>
            <FieldLabel htmlFor="resolutionTimeMinutes">
              Resolution Time (minutes) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="resolutionTimeMinutes"
              type="number"
              min="1"
              max="43200"
              placeholder="e.g., 480"
              aria-invalid={!!errors.resolutionTimeMinutes}
              {...register("resolutionTimeMinutes", { valueAsNumber: true })}
            />
            <FieldDescription>
              Time within which the issue must be resolved
            </FieldDescription>
            <FieldError errors={[errors.resolutionTimeMinutes]} />
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
            <Button
              type="submit"
              disabled={isSubmitting || (!isEditMode && availablePriorities.length === 0)}
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update SLA"
                  : "Create SLA"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
