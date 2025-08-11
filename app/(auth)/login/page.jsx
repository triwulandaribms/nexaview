'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Token is set as httpOnly cookie by the server
        // Store user info in localStorage for client-side access
        localStorage.setItem('user', JSON.stringify(data.user))

        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #f5576c 60%, #4facfe 80%, #00f2fe 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite'
      }}
    >
      {/* Premium Gradient Overlays */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 118, 117, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)'
        }}
      />

      {/* Floating Premium Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20"
          style={{
            background: 'linear-gradient(45deg, #ff9a9e, #fecfef, #fecfef)',
            filter: 'blur(40px)'
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-15"
          style={{
            background: 'linear-gradient(45deg, #a8edea, #fed6e3)',
            filter: 'blur(60px)'
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'linear-gradient(45deg, #ffecd2, #fcb69f)',
            filter: 'blur(50px)',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo and Title */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >

          <motion.h1
            className="text-4xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 20px rgba(255,255,255,0.5)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.8 }
            }}
          >
            Welcome Back
          </motion.h1>
          <motion.p
            className="text-lg font-medium"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.025em',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.4, duration: 0.8 }
            }}
          >
            Sign in to your premium account
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="p-10 rounded-3xl backdrop-blur-xl relative"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px) saturate(180%)'
          }}
          variants={cardVariants}
        >

          {/* Error Message */}
          {error && (
            <motion.div
              className="p-3 rounded-lg text-sm text-center"
              style={{
                background: 'rgb(254, 226, 226)',
                color: 'var(--error)',
                border: '1px solid var(--error)'
              }}
              variants={itemVariants}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={itemVariants}
          >
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-3"
                style={{
                  color: '#374151',
                  letterSpacing: '0.025em'
                }}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    size={18}
                    style={{ color: 'var(--text-tertiary)' }}
                  />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl border focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#1f2937',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '--tw-ring-color': '#667eea',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-3"
                style={{
                  color: '#374151',
                  letterSpacing: '0.025em'
                }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    size={18}
                    style={{ color: 'var(--text-tertiary)' }}
                  />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-4 rounded-2xl border focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#1f2937',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '--tw-ring-color': '#667eea',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      style={{ color: 'var(--text-tertiary)' }}
                    />
                  ) : (
                    <Eye
                      size={18}
                      style={{ color: 'var(--text-tertiary)' }}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-2"
                  style={{
                    borderColor: 'var(--border-medium)',
                    accentColor: 'var(--primary)'
                  }}
                />
                <span
                  className="ml-2 text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: isLoading ? 'rgba(107, 114, 128, 0.8)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                boxShadow: isLoading ? 'none' : '0 20px 40px -12px rgba(102, 126, 234, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              whileHover={!isLoading ? {
                y: -2
              } : {}}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.div
            className="mt-6 text-center"
            variants={itemVariants}
          >
            <p
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
} 