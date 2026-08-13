import AuthLayout from "../components/AuthLayout";
import VerifyResetCodeForm from "../components/VerifyResetCodeForm";

export default function VerifyResetCodePage() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-6 w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Verify Reset Code</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the code we sent to your email
          </p>
        </div>
        <VerifyResetCodeForm />
      </div>
    </AuthLayout>
  );
}
