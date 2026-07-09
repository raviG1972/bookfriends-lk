'use client'

import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'

export default function LandingView() {
  const setView = useAppStore((s) => s.setView)

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Book collage background */}
      <div className="absolute inset-0 book-collage opacity-30" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />

      {/* Centered card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-2">
          <BookOpen className="w-8 h-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Book</span>
            <span style={{ color: '#0d9488' }}>Friends</span>
            <span className="text-primary">.lk</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-center text-muted-foreground mb-8 text-sm">
          Where all the books gather together!
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="w-full text-base h-12 rounded-xl"
              onClick={() => setView('onboarding-categories')}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Books
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="lg"
              className="w-full text-base h-12 rounded-xl border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
              onClick={() => setView('auth-login')}
            >
              I have an account
            </Button>
          </motion.div>
        </div>

        {/* Decorative bottom text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Discover books in Sinhala, English & Tamil
        </p>
      </motion.div>
    </div>
  )
}