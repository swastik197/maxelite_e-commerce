"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setError(data.error || data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4'>
      <div className='w-full max-w-4xl flex overflow-hidden shadow-2xl rounded-2xl bg-white'>
        {/* Left Side - Creative Visual */}
        <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-700 via-violet-600 to-indigo-800 relative overflow-hidden'>
          <div className='absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse'></div>
          <div className='absolute bottom-32 right-20 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-700'></div>
          <div className='absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-300'></div>

          <div className='relative z-10 flex flex-col justify-center px-12 text-white w-full h-full'>
            <h1 className='text-4xl font-bold mb-4'>MaxElite</h1>
            <p className='text-lg text-white/80 mb-8'>Your premium shopping destination</p>

            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm'>✓</div>
                <span className='text-white/90 text-sm'>Exclusive deals &amp; offers</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm'>✓</div>
                <span className='text-white/90 text-sm'>Fast &amp; free shipping</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm'>✓</div>
                <span className='text-white/90 text-sm'>24/7 customer support</span>
              </div>
            </div>
          </div>
          <div className='absolute -bottom-20 -left-20 w-64 h-64 border border-white/20 rounded-full'></div>
          <div className='absolute -bottom-10 -left-10 w-64 h-64 border border-white/10 rounded-full'></div>
        </div>

        {/* Right Side - Signup Form */}
        <div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50'>
          <div className='w-full max-w-sm mx-auto'>
            <div className='lg:hidden text-center mb-6'>
              <span className='text-3xl font-bold text-purple-600'>MaxElite</span>
            </div>

            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Create Account</h2>
            <p className='text-gray-500 text-sm mb-6'>Join MaxElite for the best shopping experience</p>

            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm mb-4'>
                {error}
              </div>
            )}
            {success && (
              <div className='bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-lg text-sm mb-4'>
                {success}
              </div>
            )}

            <form onSubmit={handleSignup} className='space-y-4'>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Full Name'
                className='w-full px-5 py-3.5 text-gray-900 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition'
                required
              />

              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Email'
                className='w-full px-5 text-gray-900 py-3.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition'
                required
              />

              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Password'
                  className='w-full px-5 py-3.5 text-gray-900 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? <VisibilityOffIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
                </button>
              </div>

              <label className='flex items-center gap-2 text-xs text-gray-500'>
                <input type='checkbox' className='w-3.5 h-3.5 accent-purple-600' required />
                <span>I agree to the <Link href='/terms' className='text-purple-600 hover:underline'>Terms</Link> &amp; <Link href='/privacy' className='text-purple-600 hover:underline'>Privacy</Link></span>
              </label>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-purple-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition duration-300 shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className='flex items-center my-6'>
              <div className='flex-1 border-t border-gray-300'></div>
              <span className='px-4 text-gray-400 text-xs'>or continue with</span>
              <div className='flex-1 border-t border-gray-300'></div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
              <button className='w-full sm:flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm'>
                <svg className='w-4 h-4' viewBox='0 0 24 24'>
                  <path fill='#EA4335' d='M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z'/>
                  <path fill='#34A853' d='M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z'/>
                  <path fill='#4A90E2' d='M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z'/>
                  <path fill='#FBBC05' d='M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.44478074,15.7395684 1.23746264,17.3349879 L5.27698177,14.2678769 Z'/>
                </svg>
                Google
              </button>
              <button className='w-full sm:flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm'>
                <svg className='w-4 h-4 text-blue-600' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                </svg>
                Facebook
              </button>
            </div>

            <p className='text-center text-sm text-gray-500 mt-6'>
              Already have an account?{' '}
              <Link href='/' className='text-purple-600 font-medium hover:underline'>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
