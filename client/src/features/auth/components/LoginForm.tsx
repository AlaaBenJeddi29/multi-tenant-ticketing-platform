import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { ROUTES } from "@/app/router/routes";

import {
  loginSchema,
  type LoginFormData,
} from "@/features/auth/schemas/login.schema";

import { useLogin } from "@/features/auth/hooks/useLogin";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const loginMutation = useLogin();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dismissedBanner, setDismissedBanner] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // Check for success query params
  const showRegisteredBanner = searchParams.get("registered") === "true" && dismissedBanner !== "registered";
  const showResetBanner = searchParams.get("reset") === "true" && dismissedBanner !== "reset";

  const handleDismissBanner = (type: string) => {
    setDismissedBanner(type);
    // Remove query param from URL
    searchParams.delete(type);
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6 w-full", className)}
      {...props}
    >
      <FieldGroup>
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to your workspace.
          </p>
        </div>

        {/* Success Banner for Registration */}
        {showRegisteredBanner && (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
            <div className="flex items-start justify-between">
              <AlertDescription className="flex-1">
                ✓ Account created successfully — please log in.
              </AlertDescription>
              <button
                type="button"
                onClick={() => handleDismissBanner("registered")}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 ml-2"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </Alert>
        )}

        {/* Success Banner for Password Reset */}
        {showResetBanner && (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
            <div className="flex items-start justify-between">
              <AlertDescription className="flex-1">
                ✓ Password updated successfully — please log in.
              </AlertDescription>
              <button
                type="button"
                onClick={() => handleDismissBanner("reset")}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 ml-2"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </Alert>
        )}

        <Field>
          <FieldLabel htmlFor="email">
            Email
          </FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />

          <FieldError
            errors={
              errors.email
                ? [{ message: errors.email.message }]
                : []
            }
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">
              Password
            </FieldLabel>

            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />

          <FieldError
            errors={
              errors.password
                ? [{ message: errors.password.message }]
                : []
            }
          />
        </Field>

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending
            ? "Signing in..."
            : "Sign in"}
        </Button>

        <FieldSeparator>
          Or continue with
        </FieldSeparator>

        <Button
          variant="outline"
          type="button"
          className="w-full"
        >
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 .297c-6.63 0-12 5.373-12 12
              0 5.303 3.438 9.8 8.205 11.385
              .6.113.82-.258.82-.577
              0-.285-.01-1.04-.015-2.04
              -3.338.724-4.042-1.61-4.042-1.61
              -.546-1.385-1.335-1.755-1.335-1.755
              -1.087-.744.084-.729.084-.729
              1.205.084 1.838 1.236 1.838 1.236
              1.07 1.835 2.809 1.305 3.495.998
              .108-.776.417-1.305.76-1.605
              -2.665-.3-5.466-1.332-5.466-5.93
              0-1.31.465-2.38 1.235-3.22
              -.135-.303-.54-1.523.105-3.176
              0 0 1.005-.322 3.3 1.23
              .96-.267 1.98-.399 3-.405
              1.02.006 2.04.138 3 .405
              2.28-1.552 3.285-1.23 3.285-1.23
              .645 1.653.24 2.873.12 3.176
              .765.84 1.23 1.91 1.23 3.22
              0 4.61-2.805 5.625-5.475 5.92
              .42.36.81 1.096.81 2.22
              0 1.606-.015 2.896-.015 3.286
              0 .315.21.69.825.57
              C20.565 22.092 24 17.592 24 12.297
              c0-6.627-5.373-12-12-12"
            />
          </svg>

          Continue with GitHub
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Create one
          </Link>
        </p>

        {loginMutation.isError && (
          <p className="text-center text-sm text-red-500">
            Invalid email or password.
          </p>
        )}
      </FieldGroup>
    </form>
  );
}