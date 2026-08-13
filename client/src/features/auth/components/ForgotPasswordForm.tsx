'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldGroup, FieldError } from '@/components/ui/field'
import { ROUTES } from '@/app/router/routes'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/schemas/forgot-password.schema'
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword'
import { useToast } from '@/hooks/use-toast'

const ForgotPasswordForm = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const forgotPasswordMutation = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data)
      
      toast({
        title: "Reset code sent",
        description: "Check your email for the password reset code.",
      })
      
      // Navigate to reset password page with email in state
      navigate(ROUTES.RESET_PASSWORD, { state: { email: data.email } })
    } catch (error: any) {
      toast({
        title: "Failed to send reset code",
        description: error.response?.data?.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className='gap-4'>
        {/* Email Field */}
        <Field>
          <FieldLabel className='leading-5' htmlFor='userEmail'>
            Email address*
          </FieldLabel>
          <Input
            type='email'
            id='userEmail'
            placeholder='Enter your email address'
            aria-invalid={errors.email ? 'true' : 'false'}
            {...register('email')}
          />
          <FieldError
            errors={errors.email ? [{ message: errors.email.message }] : []}
          />
        </Field>

        {/* Submit Button */}
        <Field>
          <Button 
            className='w-full' 
            type='submit' 
            disabled={isSubmitting || forgotPasswordMutation.isPending}
          >
            {isSubmitting || forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default ForgotPasswordForm