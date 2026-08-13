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
import { useCreateUser } from "../hooks/useCreateUser";
import {
  createUserSchema,
  type CreateUserFormData,
} from "../schemas/user.schema";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const createMutation = useCreateUser();

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "AGENT",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "AGENT",
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await createMutation.mutateAsync(data);
      onOpenChange(false);
    } catch (error) {
      // Error handled via mutation state
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Create a new user account. The user will receive their login credentials.
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

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email *</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...register("email")}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password *</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              {...register("password")}
            />
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
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
            <p className="text-xs text-muted-foreground mt-1">
              Note: SUPER_ADMIN cannot be created via this form
            </p>
          </Field>

          {/* Error Display */}
          {createMutation.isError && (
            <Alert variant="destructive">
              Failed to create user. Please try again.
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
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
