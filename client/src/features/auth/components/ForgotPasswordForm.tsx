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

const ForgotPasswordForm = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    console.log('Forgot Password Request Data:', data)
    
    // 1. Call your API here (e.g., await sendResetEmail(data))
    
    // 2. Navigate to reset password page on success
    navigate(ROUTES.RESET_PASSWORD)
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
          <Button className='w-full' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default ForgotPasswordForm