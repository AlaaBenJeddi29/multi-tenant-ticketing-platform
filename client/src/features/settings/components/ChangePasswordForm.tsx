import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

import { useChangePassword } from "../hooks/useChangePassword";
import { z } from "zod";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const { changePassword, isChanging } = useChangePassword();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const newPassword = watch("newPassword");

  const onSubmit = (data: PasswordFormData) => {
    changePassword(data);
    reset();
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Medium";
    return "Strong";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Change Password</h2>
        <p className="text-sm text-muted-foreground">
          Update your password to keep your account secure
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              {...register("currentPassword")}
              aria-invalid={!!errors.currentPassword}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
          <FieldError errors={[errors.currentPassword]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNew ? "text" : "password"}
              {...register("newPassword")}
              aria-invalid={!!errors.newPassword}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
          <FieldError errors={[errors.newPassword]} />
          {newPassword && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getStrengthColor(getPasswordStrength(newPassword))}`}
                    style={{ width: `${(getPasswordStrength(newPassword) / 6) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {getStrengthText(getPasswordStrength(newPassword))}
                </span>
              </div>
            </div>
          )}
          <FieldDescription>
            Password must be at least 8 characters and include uppercase, lowercase, and numbers
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
          <FieldError errors={[errors.confirmPassword]} />
        </Field>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isChanging}>
            {isChanging ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
