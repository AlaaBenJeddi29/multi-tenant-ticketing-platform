import AuthLayout from "../components/AuthLayout";
import { SignupForm } from "../components/RegisterForm";



export default function RegisterPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}