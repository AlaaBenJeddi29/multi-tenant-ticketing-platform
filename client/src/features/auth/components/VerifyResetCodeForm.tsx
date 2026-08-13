'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldGroup, FieldError, FieldDescription } from '@/components/ui/field'
import { ROUTES } from '@/app/router/routes'
import {
  verifyResetCodeSchema,
  type VerifyResetCodeFormData,
} from '@/features/auth/schemas/verify-reset-code.schema'
import { useVerifyResetCode } from '@/features/auth/hooks/useVerifyResetCode'
import { useToast } from '@/hooks/use-toast'

const VerifyResetCodeForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const verifyCodeMutation = useVerifyResetCode()

  // Get email from navigation state
  const state = location.state as { email?: string } | null
  const email = state?.email

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyResetCodeFormData>({
    resolver: zodResolver(verifyResetCodeSchema),
  })

  // If no email in state, redirect back to forgot password
  if (!email) {
    return <Navigate to={ROUTES.FORGOT_PASSWORD} replace />
  }

  const onSubmit = async (data: VerifyResetCodeFormData) => {
    try {
      await verifyCodeMutation.mutateAsync({ code: data.code })
      
      toast({
        title: "Code verified",
        description: "You can now set your new password.",
      })
      
      // Navigate to reset password page with email and code in state
      navigate(ROUTES.RESET_PASSWORD, { 
        state: { 
          email: email, 
          code: data.code 
        } 
      })
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.response?.data?.message || "Invalid or expired reset code.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className='gap-4'>
        <div className="text-center mb-2">
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        {/* Code Field */}
        <Field>
          <FieldLabel className='leading-5' htmlFor='code'>
            Verification Code*
          </FieldLabel>
          <Input
            type='text'
            id='code'
            placeholder='Enter 6-digit code'
            maxLength={6}
            className="text-center text-lg tracking-widest"
            aria-invalid={errors.code ? 'true' : 'false'}
            {...register('code')}
          />
          <FieldError
            errors={errors.code ? [{ message: errors.code.message }] : []}
          />
          <FieldDescription>
            Check your email for the 6-digit verification code
          </FieldDescription>
        </Field>

        {/* Submit Button */}
        <Field>
          <Button 
            className='w-full' 
            type='submit' 
            disabled={isSubmitting || verifyCodeMutation.isPending}
          >
            {isSubmitting || verifyCodeMutation.isPending ? 'Verifying...' : 'Verify Code'}
          </Button>
        </Field>

        {/* Back to forgot password link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
            className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
          >
            Didn't receive a code? Try again
          </button>
        </div>
      </FieldGroup>
    </form>
  )
}

export default VerifyResetCodeForm
