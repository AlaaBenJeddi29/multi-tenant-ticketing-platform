"use client";

import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/app/router/routes';
import { useToast } from '@/hooks/use-toast';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/features/auth/schemas/reset-password.schema';

export default function ResetPasswordForm() {
  const location = useLocation();
  const { toast } = useToast();
  const resetPasswordMutation = useResetPassword();
  
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);

  // Get email and code from navigation state (from verify code page)
  const state = location.state as { email?: string; code?: string } | null;
  const email = state?.email;
  const code = state?.code;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // If email or code is missing, redirect back to forgot password
  if (!email || !code) {
    return <Navigate to={ROUTES.FORGOT_PASSWORD} replace />;
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      // Backend expects: { code, password, confirmPassword }
      await resetPasswordMutation.mutateAsync({
        code: code,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      
      // Navigation to login handled by useResetPassword hook
      // No need to manually navigate or show toast here
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <div className="text-center mb-2">
          <p className="text-sm text-muted-foreground">
            Resetting password for <strong>{email}</strong>
          </p>
        </div>

        {/* New Password */}
        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={isPasswordVisible ? 'text' : 'password'}
              aria-invalid={errors.password ? 'true' : 'false'}
              {...register('password')}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent dark:hover:bg-transparent"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
          <FieldError
            errors={
              errors.password
                ? [{ message: errors.password.message }]
                : []
            }
          />
          <FieldDescription>
            Must have at least 8 characters with uppercase, lowercase, and number
          </FieldDescription>
        </Field>

        {/* Confirm Password */}
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              {...register('confirmPassword')}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent dark:hover:bg-transparent"
              onClick={toggleConfirmPasswordVisibility}
            >
              {isConfirmPasswordVisible ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle confirm password visibility</span>
            </Button>
          </div>
          <FieldError
            errors={
              errors.confirmPassword
                ? [{ message: errors.confirmPassword.message }]
                : []
            }
          />
        </Field>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || resetPasswordMutation.isPending}
        >
          {isSubmitting || resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
        </Button>
      </FieldGroup>
    </form>
  );
}
