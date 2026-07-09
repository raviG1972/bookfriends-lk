'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import LandingView from '@/components/bookfriends/LandingView'
import OnboardingView from '@/components/bookfriends/OnboardingView'
import FeedView from '@/components/bookfriends/FeedView'
import AuthModal from '@/components/bookfriends/AuthModal'
import BookshelfView from '@/components/bookfriends/BookshelfView'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export default function Home() {
  const {
    currentView,
    setUser,
    fetchCategories,
    setBooks,
    setLoading,
  } = useAppStore()

  // Restore state from localStorage on mount
  useEffect(() => {
    // Restore user
    try {
      const savedUser = localStorage.getItem('bookfriends-user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      }
    } catch { /* ignore */ }

    // Restore preferences
    try {
      const savedPrefs = localStorage.getItem('bookfriends-prefs')
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs)
        if (prefs.selectedCategories) useAppStore.setState({ selectedCategories: prefs.selectedCategories })
        if (prefs.selectedLanguages) useAppStore.setState({ selectedLanguages: prefs.selectedLanguages })
        if (prefs.onboardingComplete && currentView === 'landing') {
          useAppStore.getState().setView('feed')
        }
      }
    } catch { /* ignore */ }

    // Fetch categories
    fetchCategories()

    // Fetch initial books
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/books')
        const json = await res.json()
        if (json.success) {
          setBooks(json.data.books)
        }
      } catch { /* silent */ }
      finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView />
      case 'onboarding-categories':
        return <OnboardingView step="categories" />
      case 'onboarding-languages':
        return <OnboardingView step="languages" />
      case 'feed':
      case 'book-detail':
      case 'add-book':
        return <FeedView />
      case 'bookshelf':
        return <BookshelfView />
      case 'auth-login':
      case 'auth-register':
        return <AuthModal />
      default:
        return <LandingView />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-1 flex flex-col"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}