'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useAppStore } from '@/store/useAppStore'

export default function AuthModal() {
  const { setView, setUser, currentView } = useAppStore()
  const isLogin = currentView === 'auth-login'

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Register state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  // Validation errors
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({})
  const [regErrors, setRegErrors] = useState<{ name?: string; email?: string; password?: string }>({})

  const validateLogin = () => {
    const errors: { email?: string; password?: string } = {}
    if (!loginEmail.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errors.email = 'Invalid email'
    if (!loginPassword) errors.password = 'Password is required'
    setLoginErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateRegister = () => {
    const errors: { name?: string; email?: string; password?: string } = {}
    if (!regName.trim()) errors.name = 'Name is required'
    if (!regEmail.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(regEmail)) errors.email = 'Invalid email'
    if (!regPassword) errors.password = 'Password is required'
    else if (regPassword.length < 6) errors.password = 'Password must be at least 6 characters'
    setRegErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateLogin()) return

    setLoginLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        toast.error(json.error || `Server error (${res.status})`)
        return
      }
      const json = await res.json()
      if (json.success) {
        const userData = json.data
        setUser(userData)
        localStorage.setItem('bookfriends-user', JSON.stringify(userData))
        toast.success(`Welcome back, ${userData.name}!`)
        // Go to feed directly for returning users
        setView('feed')
      } else {
        toast.error(json.error || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      toast.error('Network error. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateRegister()) return

    setRegLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          preferredLanguages: 'english',
        }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        toast.error(json.error || `Server error (${res.status})`)
        return
      }
      const json = await res.json()
      if (json.success) {
        const userData = json.data
        setUser(userData)
        localStorage.setItem('bookfriends-user', JSON.stringify(userData))
        toast.success(`Welcome to BookFriends, ${userData.name}!`)
        setView('onboarding-categories')
      } else {
        toast.error(json.error || 'Registration failed')
      }
    } catch (err) {
      console.error('Register error:', err)
      toast.error('Network error. Please try again.')
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-warm-50">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-teal-600/10 p-6 text-center border-b">
          <BookOpen className="w-10 h-10 text-primary mx-auto mb-2" />
          <h2 className="text-xl font-bold">
            <span className="text-primary">Book</span>
            <span style={{ color: '#0d9488' }}>Friends</span>
            <span className="text-primary">.lk</span>
          </h2>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={isLogin ? 'login' : 'register'} className="w-full">
          <TabsList className="w-full rounded-none border-b h-12 p-0 bg-transparent">
            <TabsTrigger
              value="login"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-full"
              onClick={() => setView('auth-login')}
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-full"
              onClick={() => setView('auth-register')}
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="p-6 mt-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="rounded-lg"
                />
                {loginErrors.email && (
                  <p className="text-xs text-destructive">{loginErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="rounded-lg"
                />
                {loginErrors.password && (
                  <p className="text-xs text-destructive">{loginErrors.password}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full rounded-lg h-11"
                disabled={loginLoading}
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="p-6 mt-0">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="Your name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="rounded-lg"
                />
                {regErrors.name && (
                  <p className="text-xs text-destructive">{regErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="rounded-lg"
                />
                {regErrors.email && (
                  <p className="text-xs text-destructive">{regErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="rounded-lg"
                />
                {regErrors.password && (
                  <p className="text-xs text-destructive">{regErrors.password}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full rounded-lg h-11"
                disabled={regLoading}
              >
                {regLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Back link */}
        <div className="px-6 pb-6">
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </button>
        </div>
      </motion.div>
    </div>
  )
}