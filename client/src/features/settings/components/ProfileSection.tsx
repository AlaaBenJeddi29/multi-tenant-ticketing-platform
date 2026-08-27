import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

import { useProfile } from "../hooks/useProfile";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  phone: z.string().optional(),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileSection() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || "",
        avatarUrl: profile.avatarUrl || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || undefined,
      avatarUrl: data.avatarUrl || undefined,
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8">Failed to load profile</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Profile Information</h2>
        <p className="text-sm text-muted-foreground">
          Update your personal information
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <Input
            id="firstName"
            {...register("firstName")}
            aria-invalid={!!errors.firstName}
          />
          <FieldError errors={[errors.firstName]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <Input
            id="lastName"
            {...register("lastName")}
            aria-invalid={!!errors.lastName}
          />
          <FieldError errors={[errors.lastName]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            value={profile.email}
            disabled
            className="bg-muted"
          />
          <FieldDescription>
            Email cannot be changed
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Phone Number (Optional)</FieldLabel>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            aria-invalid={!!errors.phone}
          />
          <FieldError errors={[errors.phone]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="avatarUrl">Avatar URL (Optional)</FieldLabel>
          <Input
            id="avatarUrl"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            {...register("avatarUrl")}
            aria-invalid={!!errors.avatarUrl}
          />
          <FieldError errors={[errors.avatarUrl]} />
          <FieldDescription>
            Enter a URL for your profile picture
          </FieldDescription>
        </Field>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Account Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Role:</span>
              <p className="font-medium">{profile.role.replace("_", " ")}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Account Created:</span>
              <p className="font-medium">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Login:</span>
              <p className="font-medium">
                {profile.lastLoginAt
                  ? new Date(profile.lastLoginAt).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={!isDirty || isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
