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
    await signIn('google', { callbackUrl: '/dashboard' });
  }

  const signInWithGitHub = async() => {
    await signIn('github', { callbackUrl: '/dashboard' });
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='flex flex-col items-center border rounded-2xl p-8'>
        <Image 
          src='/logo.png' 
          alt='Logo' 
          width={400} 
          height={100}
          className='w-[180px]'
        />
          <h2 className='text-2xl font-bold text-center'>Welcome to AskUp Virtual Interview</h2>
          <p className='text-gray-500 text-center'>{isRegister ? 'Create your account' : 'Sign in to your account'}</p>
          
          {/* Email/Password Form */}
          <form onSubmit={isRegister ? registerUser : signInWithEmail} className='w-full space-y-4 mt-6'>
            {isRegister && (
              <div>
                <Input
                  type='text'
                  placeholder='Full Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
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
              />
            </div>
            <div>
              <Input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type='submit'
              className='w-full'
              disabled={loading}
            >
              {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Create Account' : 'Sign In')}
            </Button>
          </form>
          
          <button
            onClick={() => setIsRegister(!isRegister)}
            className='text-blue-600 hover:underline mt-4'
          >
            {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </button>
          
          <div className='flex items-center my-4'>
            <div className='flex-1 border-t border-gray-300'></div>
            <span className='px-3 text-gray-500 text-sm'>OR</span>
            <div className='flex-1 border-t border-gray-300'></div>
          </div>
          
          <Button 
            className='mt-7 w-full'
            onClick={signInWithGoogle}
          >
            Login with Google
          </Button>
          
          <Button 
            variant='outline'
            className='mt-3 w-full'
            onClick={signInWithGitHub}
          >
            Login with GitHub
          </Button>

        </div>
      </div>
  )
}

export default Login;