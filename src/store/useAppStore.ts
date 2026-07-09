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
  categoriesLoading: boolean

  selectedBook: Book | null
  setSelectedBook: (book: Book | null) => void
  bookComments: Comment[]
  setBookComments: (comments: Comment[]) => void

  bookshelfItems: BookshelfItem[]
  setBookshelfItems: (items: BookshelfItem[]) => void
  bookshelfFilter: string
  setBookshelfFilter: (f: string) => void
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
  categories: [],
  setBooks: (books) => set({ books }),
  setCategories: (cats) => set({ categories: cats }),
  categoriesLoading: false,
  fetchCategories: async () => {
    set({ categoriesLoading: true })
    try {
      const res = await fetch('/api/categories')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        set({ categories: json.data, categoriesLoading: false })
        return true
      }
      set({ categoriesLoading: false })
      return false
    } catch {
      set({ categoriesLoading: false })
      return false
    }
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
}))