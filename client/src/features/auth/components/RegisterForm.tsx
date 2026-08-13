import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

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
import { ROUTES } from "@/app/router/routes";
import {
  registerSchema,
  type RegisterFormData,
} from "@/features/auth/schemas/register.schema";
import { useRegister } from "@/features/auth/hooks/useRegister";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const registerMutation = useRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = data;
      
      await registerMutation.mutateAsync(registerData);
      // Navigation handled by useRegister hook
    } catch (error: any) {
      // Error will be shown by the hook or can be handled here
      console.error("Registration failed:", error);
    }
  };

  // Auto-generate slug from organization name
  const handleOrganizationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Auto-generate slug: lowercase, replace spaces with hyphens, remove special chars
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Update the slug field
    const slugInput = document.getElementById('organizationSlug') as HTMLInputElement;
    if (slugInput && !slugInput.dataset.manuallyEdited) {
      slugInput.value = slug;
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6 w-full", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {/* First Name & Last Name Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              className="bg-background"
              aria-invalid={errors.firstName ? "true" : "false"}
              {...register("firstName")}
            />
            <FieldError errors={errors.firstName ? [{ message: errors.firstName.message }] : []} />
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              className="bg-background"
              aria-invalid={errors.lastName ? "true" : "false"}
              {...register("lastName")}
            />
            <FieldError errors={errors.lastName ? [{ message: errors.lastName.message }] : []} />
          </Field>
        </div>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="bg-background"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
          />
          <FieldError errors={errors.email ? [{ message: errors.email.message }] : []} />
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="bg-background"
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password")}
          />
          <FieldError errors={errors.password ? [{ message: errors.password.message }] : []} />
        </Field>

        {/* Confirm Password */}
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="bg-background"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            {...register("confirmPassword")}
          />
          <FieldError errors={errors.confirmPassword ? [{ message: errors.confirmPassword.message }] : []} />
        </Field>

        {/* Organization Name */}
        <Field>
          <FieldLabel htmlFor="organizationName">Organization Name</FieldLabel>
          <Input
            id="organizationName"
            type="text"
            placeholder="Acme Corporation"
            className="bg-background"
            aria-invalid={errors.organizationName ? "true" : "false"}
            {...register("organizationName", {
              onChange: handleOrganizationNameChange,
            })}
          />
          <FieldError errors={errors.organizationName ? [{ message: errors.organizationName.message }] : []} />
        </Field>

        {/* Organization Slug */}
        <Field>
          <FieldLabel htmlFor="organizationSlug">Organization Slug</FieldLabel>
          <Input
            id="organizationSlug"
            type="text"
            placeholder="acme-corporation"
            className="bg-background"
            aria-invalid={errors.organizationSlug ? "true" : "false"}
            {...register("organizationSlug")}
            onFocus={(e) => {
              e.target.dataset.manuallyEdited = 'true';
            }}
          />
          <p className="text-xs text-muted-foreground mt-1">
            This will be part of your organization's URL. Use lowercase letters, numbers, and hyphens only.
          </p>
          <FieldError errors={errors.organizationSlug ? [{ message: errors.organizationSlug.message }] : []} />
        </Field>

        {/* Submit Button */}
        <Field>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || registerMutation.isPending}
          >
            {isSubmitting || registerMutation.isPending ? "Creating account..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        {/* GitHub OAuth Button */}
        <Field>
          <Button variant="outline" type="button" className="w-full">
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Sign up with GitHub
          </Button>

          <p className="px-6 text-center text-sm text-muted-foreground mt-2">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
        </Field>
      </FieldGroup>
    </form>
  );
}