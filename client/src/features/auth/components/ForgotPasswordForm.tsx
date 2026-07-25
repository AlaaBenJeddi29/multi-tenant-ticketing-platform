'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldGroup, FieldError } from '@/components/ui/field'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/schemas/forgot-password.schema' // Adjust this import path to match your folder structure

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    // Replace with your API call/auth service (e.g. await sendPasswordResetEmail(data.email))
    console.log('Forgot Password Request Data:', data)
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