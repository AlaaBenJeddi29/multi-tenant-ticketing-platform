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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { priorityFormSchema, type PriorityFormValues } from "../schemas/priority.schema";
import { useCreatePriority } from "../hooks/useCreatePriority";
import { useUpdatePriority } from "../hooks/useUpdatePriority";

import type { Priority } from "../types/priority.types";

interface PriorityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priority?: Priority | null;
}

export function PriorityFormDialog({
  open,
  onOpenChange,
  priority,
}: PriorityFormDialogProps) {
  const isEditMode = !!priority;

  const createMutation = useCreatePriority();
  const updateMutation = useUpdatePriority();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PriorityFormValues>({
    resolver: zodResolver(priorityFormSchema),
    defaultValues: {
      name: "",
      level: "MEDIUM",
      color: "#000000",
    },
  });

  const colorValue = watch("color");

  // Reset form when dialog opens or priority changes
  useEffect(() => {
    if (open) {
      reset({
        name: priority?.name || "",
        level: (priority?.level as any) || "MEDIUM",
        color: priority?.color || "#000000",
      });
    }
  }, [open, priority, reset]);

  const onSubmit = async (data: PriorityFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: priority.id,
          input: {
            name: data.name,
            level: data.level,
            color: data.color,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          level: data.level,
          color: data.color,
        });
      }

      // Close dialog and reset form on success
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error is handled by React Query, just log for debugging
      console.error("Failed to save priority:", error);
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
            {isEditMode ? "Edit Priority" : "Create New Priority"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the priority details below."
              : "Add a new priority level for ticket classification."}
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
              placeholder="e.g., Low, Medium, High, Critical"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          {/* Level Field */}
          <Field>
            <FieldLabel htmlFor="level">
              Level <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={String(priority?.level || "MEDIUM")}
              onValueChange={(value: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL") => setValue("level", value)}
            >
              <SelectTrigger id="level">
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.level]} />
          </Field>

          {/* Color Field */}
          <Field>
            <FieldLabel htmlFor="color">
              Color <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="flex items-center gap-2">
              <Input
                id="color-picker"
                type="color"
                className="w-16 h-10 p-1"
                value={colorValue}
                onChange={(e) => setValue("color", e.target.value)}
                aria-invalid={!!errors.color}
              />
              <Input
                id="color"
                placeholder="#000000"
                className="flex-1"
                value={colorValue}
                onChange={(e) => setValue("color", e.target.value)}
                aria-invalid={!!errors.color}
              />
            </div>
            <FieldError errors={[errors.color]} />
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
                  ? "Update Priority"
                  : "Create Priority"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
