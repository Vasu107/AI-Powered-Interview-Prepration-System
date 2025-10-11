"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const router = useRouter();

  const signInWithEmail = async(e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      toast.error('Invalid credentials');
    } else {
      toast.success('Login successful!');
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const registerUser = async(e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Registration successful! Please sign in.');
        setIsRegister(false);
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed');
    }
    setLoading(false);
  };

  const signInWithGoogle = async() => {
    await signIn('google', { callbackUrl: '/dashboard'});
  }

  const signInWithGitHub = async() => {
    await signIn('github', { callbackUrl: '/dashboard' });
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='flex flex-col items-center border rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md mx-auto bg-white shadow-lg'>
        <Image 
          src='/logo.png' 
          alt='Logo' 
          width={400} 
          height={100}
          className='w-32 sm:w-40 lg:w-[180px] mb-4'
        />
        <h2 className='text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2'>Welcome to AskUp Virtual Interview</h2>
        <p className='text-sm sm:text-base text-gray-500 text-center mb-6'>{isRegister ? 'Create your account' : 'Sign in to your account'}</p>
        
        {/* Email/Password Form */}
        <form onSubmit={isRegister ? registerUser : signInWithEmail} className='w-full space-y-3 sm:space-y-4'>
          {isRegister && (
            <div>
              <Input
                type='text'
                placeholder='Full Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='h-10 sm:h-11'
              />
            </div>
          )}
          <div>
            <Input
              type='email'
              placeholder='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='h-10 sm:h-11'
            />
          </div>
          <div>
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='h-10 sm:h-11'
            />
          </div>
          <Button 
            type='submit'
            className='w-full h-10 sm:h-11 text-sm sm:text-base'
            disabled={loading}
          >
            {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Create Account' : 'Sign In')}
          </Button>
        </form>
        
        <button
          onClick={() => setIsRegister(!isRegister)}
          className='text-blue-600 hover:underline mt-3 sm:mt-4 text-sm sm:text-base'
        >
          {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
        </button>
        
        <div className='flex items-center my-4 sm:my-6 w-full'>
          <div className='flex-1 border-t border-gray-300'></div>
          <span className='px-3 text-gray-500 text-xs sm:text-sm'>OR</span>
          <div className='flex-1 border-t border-gray-300'></div>
        </div>
        
        <Button 
          className='w-full h-10 sm:h-11 text-sm sm:text-base mb-3'
          onClick={signInWithGoogle}
          disabled={loading}
        >
          Login with Google
        </Button>
        
        <Button 
          variant='outline'
          className='w-full h-10 sm:h-11 text-sm sm:text-base'
          onClick={signInWithGitHub}
          disabled={loading}
        >
          Login with GitHub
        </Button>
      </div>
    </div>
  )
}

export default Login;