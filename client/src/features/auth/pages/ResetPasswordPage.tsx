import AuthLayout from "../components/AuthLayout";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-6 w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create New Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Set a new secure password for your account
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </AuthLayout>
  );
}