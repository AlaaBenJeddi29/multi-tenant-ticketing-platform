import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm'
import AuthBackgroundShape from '@/assets/svg/auth-background-shape'
import Logo from '@/components/shadcn-studio/logo'
import { ROUTES } from '@/app/router/routes' // Adjust path if needed

const ForgotPassword = () => {
  const navigate = useNavigate()

  return (
    <div className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute'>
        <AuthBackgroundShape />
      </div>

      <Card className='z-1 w-full gap-6 py-6 sm:max-w-md'>
        <CardHeader className='gap-6 px-6'>
          <Logo className='gap-3' />

          <div>
            <CardTitle className='mb-1.5 text-2xl font-semibold'>Forgot Password?</CardTitle>
            <CardDescription className='text-base'>
              Enter your email and we&apos;ll send you instructions to reset your password
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-4 px-6'>
          {/* ForgotPassword Form */}
          <ForgotPasswordForm />

          {/* Clean navigation without asChild collisions */}
          <Button
            type='button'
            variant='ghost'
            className='group w-full gap-2'
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            <ChevronLeftIcon className='size-5 transition-transform duration-200 group-hover:-translate-x-0.5' />
            Back to login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword