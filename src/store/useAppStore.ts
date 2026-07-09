import { create } from 'zustand'

export type AppView = 'landing' | 'onboarding-categories' | 'onboarding-languages' | 'feed' | 'book-detail' | 'bookshelf' | 'auth-login' | 'auth-register' | 'add-book'

export interface Book {
  id: string
  title: string
  titleSi?: string
  titleTa?: string
  author: string
  publisher?: string
  isbn?: string
  language: string
  year?: number
  pageCount?: number
  description?: string
  coverImage?: string
  categoryId?: string
  status: string
  likes: number
  readingCount: number
  listeningCount: number
  createdAt: string
  updatedAt: string
  category?: Category
  commentCount?: number
  inBookshelf?: boolean
}

export interface Category {
  id: string
  name: string
  nameSi?: string
  nameTa?: string
  icon: string
  slug: string
  bookCount: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  preferredLanguages: string
}

export interface BookshelfItem {
  id: string
  userId: string
  bookId: string
  status: string
  addedAt: string
  book?: Book
}

export interface Comment {
  id: string
  content: string
  userId: string
  bookId: string
  createdAt: string
  user?: { name: string; avatar?: string }
}

// Fallback categories — always available, even without server
const FALLBACK_CATEGORIES: Category[] = [
  { id: 'cat-fiction', name: 'Fiction & Novels', nameSi: 'ප්‍රබන්ධ සහ නවකතා', nameTa: 'புனைவு மற்றும் நாவல்கள்', icon: '📖', slug: 'fiction', bookCount: 3 },
  { id: 'cat-children', name: "Children's Books", nameSi: 'ළමා පොත්', nameTa: 'குழந்தைகள் புத்தகங்கள்', icon: '🧸', slug: 'children', bookCount: 2 },
  { id: 'cat-biography', name: 'Biography', nameSi: 'චරිතාපදාන', nameTa: 'சுயசரிதை', icon: '👤', slug: 'biography', bookCount: 2 },
  { id: 'cat-history', name: 'History', nameSi: 'ඉතිහාසය', nameTa: 'வரலாறு', icon: '🏛️', slug: 'history', bookCount: 1 },
  { id: 'cat-self-help', name: 'Self-Help', nameSi: 'ස්වයං සහාය', nameTa: 'சுய உதவி', icon: '🧘', slug: 'self-help', bookCount: 1 },
  { id: 'cat-poetry', name: 'Poetry', nameSi: 'කවි', nameTa: 'கவிதை', icon: '🌸', slug: 'poetry', bookCount: 1 },
  { id: 'cat-science', name: 'Science', nameSi: 'විද්‍යාව', nameTa: 'அறிவியல்', icon: '🔬', slug: 'science', bookCount: 1 },
  { id: 'cat-ayurveda', name: 'Ayurveda', nameSi: 'ආයුර්වේදය', nameTa: 'ஆயுர்வேதம்', icon: '🌿', slug: 'ayurveda', bookCount: 1 },
  { id: 'cat-astrology', name: 'Astrology', nameSi: 'ජ්‍යෝතිෂය', nameTa: 'ஜோதிடம்', icon: '🔮', slug: 'astrology', bookCount: 1 },
  { id: 'cat-adventure', name: 'Adventure', nameSi: 'විස්සායන', nameTa: 'சாகசம்', icon: '🗺️', slug: 'adventure', bookCount: 2 },
  { id: 'cat-romance', name: 'Romance', nameSi: 'ප්‍රේම වෘත්තී', nameTa: 'காதல் கதைகள்', icon: '💕', slug: 'romance', bookCount: 1 },
  { id: 'cat-cooking', name: 'Cooking', nameSi: 'කෑම සෑදීම', nameTa: 'சமையல்', icon: '🍳', slug: 'cooking', bookCount: 1 },
  { id: 'cat-dictionaries', name: 'Dictionaries', nameSi: 'ශබ්දකෝෂ', nameTa: 'அகராதிகள்', icon: '📚', slug: 'dictionaries', bookCount: 1 },
  { id: 'cat-teens', name: 'Teens', nameSi: 'යොවුන්', nameTa: 'இளம் வயதினர்', icon: '🎯', slug: 'teens', bookCount: 1 },
  { id: 'cat-religion', name: 'Religion', nameSi: 'ආගම', nameTa: 'மதம்', icon: '🙏', slug: 'religion', bookCount: 1 },
  { id: 'cat-business', name: 'Business', nameSi: 'ව්‍යාපාර', nameTa: 'வணிகம்', icon: '💼', slug: 'business', bookCount: 1 },
]

// Fallback demo user
const DEMO_USER: User = {
  id: 'demo-user-001',
  name: 'Demo User',
  email: 'demo@bookfriends.lk',
  role: 'reader',
  preferredLanguages: 'sinhala,english',
}

interface AppState {
  currentView: AppView
  previousView: AppView | null
  setView: (view: AppView) => void
  goBack: () => void

  user: User | null
  setUser: (user: User | null) => void

  selectedCategories: string[]
  selectedLanguages: string[]
  toggleCategory: (id: string) => void
  toggleLanguage: (lang: string) => void
  resetOnboarding: () => void

  books: Book[]
  categories: Category[]
  setBooks: (books: Book[]) => void
  setCategories: (cats: Category[]) => void
  fetchCategories: () => Promise<boolean>
  activeCategory: string | null
  setActiveCategory: (slug: string | null) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  sortBy: string
  setSortBy: (s: string) => void
  isLoading: boolean
  setLoading: (l: boolean) => void

  selectedBook: Book | null
  setSelectedBook: (book: Book | null) => void
  bookComments: Comment[]
  setBookComments: (comments: Comment[]) => void

  bookshelfItems: BookshelfItem[]
  setBookshelfItems: (items: BookshelfItem[]) => void
  bookshelfFilter: string
  setBookshelfFilter: (f: string) => void

  // Client-side auth fallback
  loginAsDemo: () => void
  registerLocal: (name: string, email: string, password: string) => { success: boolean; error?: string }
  loginLocal: (email: string, password: string) => { success: boolean; error?: string; user?: User }
}

// Get stored users from localStorage
function getStoredUsers(): Array<User & { password: string }> {
  try {
    const data = localStorage.getItem('bookfriends-users')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveStoredUsers(users: Array<User & { password: string }>) {
  localStorage.setItem('bookfriends-users', JSON.stringify(users))
}

export const useAppStore = create<AppState>((set, get) => ({
  currentView: 'landing',
  previousView: null,
  setView: (view) => set({ currentView: view, previousView: get().currentView }),
  goBack: () => set({ currentView: get().previousView || 'feed', previousView: null }),

  user: null,
  setUser: (user) => set({ user }),

  selectedCategories: [],
  selectedLanguages: [],
  toggleCategory: (id) => {
    const sel = get().selectedCategories
    set({ selectedCategories: sel.includes(id) ? sel.filter((c) => c !== id) : [...sel, id] })
  },
  toggleLanguage: (lang) => {
    const sel = get().selectedLanguages
    set({ selectedLanguages: sel.includes(lang) ? sel.filter((l) => l !== lang) : [...sel, lang] })
  },
  resetOnboarding: () => set({ selectedCategories: [], selectedLanguages: [] }),

  books: [],
  categories: FALLBACK_CATEGORIES, // Start with fallback data
  setBooks: (books) => set({ books }),
  setCategories: (cats) => set({ categories: cats }),
  fetchCategories: async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const json = await res.json()
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          set({ categories: json.data })
          return true
        }
      }
    } catch {
      // Server unavailable, keep fallback
    }
    // Always ensure we have categories (use fallback if API failed)
    const current = get().categories
    if (current.length === 0) {
      set({ categories: FALLBACK_CATEGORIES })
    }
    return false
  },
  activeCategory: null,
  setActiveCategory: (slug) => set({ activeCategory: slug }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  sortBy: 'popular',
  setSortBy: (s) => set({ sortBy: s }),
  isLoading: false,
  setLoading: (l) => set({ isLoading: l }),

  selectedBook: null,
  setSelectedBook: (book) => set({ selectedBook: book, bookComments: [] }),
  bookComments: [],
  setBookComments: (comments) => set({ bookComments: comments }),

  bookshelfItems: [],
  setBookshelfItems: (items) => set({ bookshelfItems: items }),
  bookshelfFilter: 'all',
  setBookshelfFilter: (f) => set({ bookshelfFilter: f }),

  // Client-side auth — works even without server
  loginAsDemo: () => {
    const userData = { ...DEMO_USER }
    set({ user: userData })
    localStorage.setItem('bookfriends-user', JSON.stringify(userData))
  },

  registerLocal: (name, email, password) => {
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required' }
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }
    const users = getStoredUsers()
    if (users.find((u) => u.email === email)) {
      return { success: false, error: 'Email already registered' }
    }
    const newUser: User & { password: string } = {
      id: `local-${Date.now()}`,
      name,
      email,
      role: 'reader',
      preferredLanguages: 'english',
      password,
    }
    users.push(newUser)
    saveStoredUsers(users)
    const { password: _, ...userWithoutPassword } = newUser
    set({ user: userWithoutPassword })
    localStorage.setItem('bookfriends-user', JSON.stringify(userWithoutPassword))
    return { success: true }
  },

  loginLocal: (email, password) => {
    // Check demo credentials
    if (email === 'demo@bookfriends.lk' && password === 'demo123') {
      const userData = { ...DEMO_USER }
      set({ user: userData })
      localStorage.setItem('bookfriends-user', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    // Check local users
    const users = getStoredUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (found) {
      const { password: _, ...userWithoutPassword } = found
      set({ user: userWithoutPassword })
      localStorage.setItem('bookfriends-user', JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    }
    // Try server login as fallback
    return { success: false, error: 'Invalid email or password' }
  },
}))