import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm'
import { ROUTES } from '@/app/router/routes'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Gradient background matching BrandPanel */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
      <div className="absolute inset-0 bg-background/5" />

      {/* Centered form */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-6 sm:p-8 shadow-lg">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we'll send you instructions to reset your password
            </p>
          </div>

          {/* Form */}
          <ForgotPasswordForm />

          {/* Back to login button */}
          <Button
            type="button"
            variant="ghost"
            className="group w-full gap-2 mt-4"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            <ChevronLeftIcon className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to login
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage