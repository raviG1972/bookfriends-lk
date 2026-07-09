'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, BookOpen, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/store/useAppStore'

const languages = [
  { code: 'sinhala', label: 'සිංහල (Sinhala)', flag: '🇱🇰' },
  { code: 'english', label: 'English', flag: '🇬🇧' },
  { code: 'tamil', label: 'தமிழ் (Tamil)', flag: '🇱🇰' },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

interface OnboardingViewProps {
  step: 'categories' | 'languages'
}

export default function OnboardingView({ step }: OnboardingViewProps) {
  const {
    categories,
    setCategories,
    selectedCategories,
    selectedLanguages,
    toggleCategory,
    toggleLanguage,
    setView,
    setBooks,
    setLoading,
    fetchCategories,
  } = useAppStore()

  const [direction, setDirection] = useState(1)
  const [loading, setLoadingLocal] = useState(false)

  // Categories are now embedded as fallback — always available
  // Still try to fetch from server for fresh data
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleContinue = () => {
    if (step === 'categories') {
      setDirection(1)
      setView('onboarding-languages')
    } else {
      handleFinish()
    }
  }

  const handleFinish = async () => {
    setLoadingLocal(true)
    setLoading(true)

    // Save preferences to localStorage
    const prefs = {
      selectedCategories,
      selectedLanguages,
      onboardingComplete: true,
    }
    localStorage.setItem('bookfriends-prefs', JSON.stringify(prefs))

    // Fetch all books (preferences are saved for future filtering,
    // but the initial feed shows all books so users always see content)
    try {
      const params = new URLSearchParams()
      if (selectedLanguages.length > 0) {
        params.set('language', selectedLanguages.join(','))
      }
      params.set('sort', 'popular')
      const res = await fetch(`/api/books?${params.toString()}`)
      const json = await res.json()
      if (json.success) {
        setBooks(json.data.books)
      }
    } catch {
      // fallback: use whatever books are already in the store
    }

    setLoading(false)
    setLoadingLocal(false)
    setView('feed')
  }

  if (step === 'categories') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-warm-50">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key="categories"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">What do you love to read?</h2>
              <p className="text-muted-foreground">Pick at least 3 categories</p>
            </div>

            {/* Categories grid — always available via fallback */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
              {categories.map((cat, index) => {
                  const isSelected = selectedCategories.includes(cat.id)
                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => toggleCategory(cat.id)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected
                          ? 'border-primary bg-warm-50 shadow-sm'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-sm font-medium text-center leading-tight">{cat.name}</span>
                      {cat.bookCount > 0 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {cat.bookCount}
                        </Badge>
                      )}
                    </motion.button>
                  )
                })}
              </div>

            <div className="flex flex-col items-center gap-3">
              <p className={`text-sm ${selectedCategories.length >= 3 ? 'text-teal-600 font-medium' : 'text-muted-foreground'}`}>
                Selected: {selectedCategories.length}/3 minimum
              </p>
              <Button
                size="lg"
                className="rounded-xl px-8"
                disabled={selectedCategories.length < 3}
                onClick={handleContinue}
              >
                Continue
              </Button>
              <button
                onClick={() => setView('landing')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // Languages step
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-warm-50">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key="languages"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Globe className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">Which languages do you read?</h2>
            <p className="text-muted-foreground">Select one or more languages</p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {languages.map((lang, index) => {
              const isSelected = selectedLanguages.includes(lang.code)
              return (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => toggleLanguage(lang.code)}
                  className={`flex items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? 'border-primary bg-warm-50 shadow-sm'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <span className="text-lg font-medium">{lang.label}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>

          <div className="flex flex-col items-center gap-3">
            <Button
              size="lg"
              className="rounded-xl px-8"
              disabled={selectedLanguages.length === 0 || loading}
              onClick={handleFinish}
            >
              {loading ? 'Loading books...' : 'Start Exploring'}
            </Button>
            <button
              onClick={() => {
                setDirection(-1)
                setView('onboarding-categories')
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to categories
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}