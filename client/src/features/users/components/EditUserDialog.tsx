import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { useUpdateUser } from "../hooks/useUpdateUser";
import {
  updateUserSchema,
  type UpdateUserFormData,
} from "../schemas/user.schema";

import type { User } from "../types/user.types";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const updateMutation = useUpdateUser();

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role === "SUPER_ADMIN" ? "ORG_ADMIN" : user.role,
    },
  });

  // Reset form when dialog opens/closes or user changes
  useEffect(() => {
    if (open) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role === "SUPER_ADMIN" ? "ORG_ADMIN" : user.role,
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        input: data,
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled via mutation state
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Password cannot be changed here - users must use the forgot password flow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <Field>
            <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
            <Input id="firstName" placeholder="John" {...register("firstName")} />
            {errors.firstName && <FieldError>{errors.firstName.message}</FieldError>}
          </Field>

          {/* Last Name */}
          <Field>
            <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
            <Input id="lastName" placeholder="Doe" {...register("lastName")} />
            {errors.lastName && <FieldError>{errors.lastName.message}</FieldError>}
          </Field>

          {/* Email (Read-only) */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </Field>

          {/* Role */}
          <Field>
            <FieldLabel htmlFor="role">Role *</FieldLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AGENT">Agent</SelectItem>
                    <SelectItem value="ORG_ADMIN">Organization Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <FieldError>{errors.role.message}</FieldError>}
            {user.role === "SUPER_ADMIN" && (
              <p className="text-xs text-muted-foreground mt-1">
                Note: SUPER_ADMIN role cannot be assigned via this form
              </p>
            )}
          </Field>

          {/* Error Display */}
          {updateMutation.isError && (
            <Alert variant="destructive">
              Failed to update user. Please try again.
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
