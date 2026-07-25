"use client";

import * as React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  ArrowRightIcon,
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  LockIcon,
  ShieldIcon,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ROUTES } from '@/app/router/routes';

import {
  verifyResetCodeSchema,
  resetPasswordSchema,
  type VerifyResetCodeFormData,
  type ResetPasswordFormData,
} from '@/features/auth/schemas/reset-password.schema'; // Adjust this import path as needed

export default function TokenReset() {
  const [step, setStep] = React.useState<'token' | 'password' | 'complete'>(
    'token'
  );
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    React.useState(false);

  // Form for Step 1: Verify Code
  const {
    register: registerCode,
    handleSubmit: handleSubmitCode,
    formState: { errors: codeErrors, isSubmitting: isSubmittingCode },
  } = useForm<VerifyResetCodeFormData>({
    resolver: zodResolver(verifyResetCodeSchema),
  });

  // Form for Step 2: Reset Password
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmitToken = async (data: VerifyResetCodeFormData) => {
    console.log('Reset Code:', data);
    // TODO: Call your API to verify code
    setStep('password');
  };

  const onSubmitPassword = async (data: ResetPasswordFormData) => {
    console.log('New Password Data:', data);
    // TODO: Call your API to reset password
    setStep('complete');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <Card className="mx-auto max-w-md">
        <CardHeader className="space-y-1">
          {step === 'token' && (
            <>
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <KeyIcon className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-center text-2xl">
                Verify Reset Code
              </CardTitle>
              <CardDescription className="text-center">
                Enter the reset code from your email to continue
              </CardDescription>
            </>
          )}

          {step === 'password' && (
            <>
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <LockIcon className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-center text-2xl">
                Create New Password
              </CardTitle>
              <CardDescription className="text-center">
                Set a new secure password for your account
              </CardDescription>
            </>
          )}

          {step === 'complete' && (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2Icon className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-center text-2xl">
                Password Updated
              </CardTitle>
              <CardDescription className="text-center">
                Your password has been reset successfully
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent>
          {/* Step indicators */}
          <div className="mb-6 flex items-center justify-center">
            <div className="flex w-2/3 items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${step !== 'token' ? 'bg-primary text-primary-foreground' : 'border-input bg-background border'}`}
              >
                1
              </div>
              <div
                className={`h-1 flex-1 ${step !== 'token' ? 'bg-primary' : 'bg-muted'}`}
              ></div>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${step === 'complete' ? 'bg-primary text-primary-foreground' : 'border-input bg-background border'}`}
              >
                2
              </div>
              <div
                className={`h-1 flex-1 ${step === 'complete' ? 'bg-primary' : 'bg-muted'}`}
              ></div>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${step === 'complete' ? 'bg-primary text-primary-foreground' : 'border-input bg-background border'}`}
              >
                3
              </div>
            </div>
          </div>

          {/* STEP 1: VERIFY CODE */}
          {step === 'token' && (
            <form onSubmit={handleSubmitCode(onSubmitToken)} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="code">Reset Code</FieldLabel>
                  <Input
                    id="code"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    aria-invalid={codeErrors.code ? 'true' : 'false'}
                    {...registerCode('code')}
                  />
                  <FieldError
                    errors={codeErrors.code ? [{ message: codeErrors.code.message }] : []}
                  />
                  <FieldDescription>
                    Check your email for the 6-digit verification code we sent you
                  </FieldDescription>
                </Field>
              </FieldGroup>
              <Button type="submit" className="w-full" disabled={isSubmittingCode}>
                {isSubmittingCode ? 'Verifying...' : 'Verify Code'}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {/* STEP 2: CREATE NEW PASSWORD */}
          {step === 'password' && (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
              <Alert className="mb-4 bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                <ShieldIcon className="h-4 w-4" />
                <AlertDescription>
                  Your identity has been verified. Now create a new secure password.
                </AlertDescription>
              </Alert>

              <FieldGroup>
                {/* New Password */}
                <Field>
                  <FieldLabel htmlFor="password">New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type={isPasswordVisible ? 'text' : 'password'}
                      aria-invalid={passwordErrors.password ? 'true' : 'false'}
                      {...registerPassword('password')}
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
                      passwordErrors.password
                        ? [{ message: passwordErrors.password.message }]
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
                      aria-invalid={passwordErrors.confirmPassword ? 'true' : 'false'}
                      {...registerPassword('confirmPassword')}
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
                      passwordErrors.confirmPassword
                        ? [{ message: passwordErrors.confirmPassword.message }]
                        : []
                    }
                  />
                </Field>
              </FieldGroup>

              <Button type="submit" className="w-full" disabled={isSubmittingPassword}>
                {isSubmittingPassword ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}

          {/* STEP 3: COMPLETE */}
          {step === 'complete' && (
            <div className="space-y-4 text-center">
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900">
                <p className="text-green-800 dark:text-green-300">
                  Your password has been successfully reset. Your account is now secure.
                </p>
              </div>
              <Link to={ROUTES.LOGIN} className={buttonVariants({ className: 'w-full' })}>
                Sign in with new password
              </Link>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          {step !== 'complete' && (
            <p className="text-muted-foreground text-sm">
              Remember your password?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary underline">
                Sign in
              </Link>
            </p>
          )}

          {step === 'complete' && (
            <p className="text-muted-foreground text-sm">
              Need help?{' '}
              <a href="#" className="text-primary underline">
                Contact support
              </a>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}