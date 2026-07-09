'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Search, BookOpen, Library, Plus, LogOut, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAppStore } from '@/store/useAppStore'

export default function Header() {
  const {
    user,
    setView,
    searchQuery,
    setSearchQuery,
    setBooks,
    setLoading,
  } = useAppStore()

  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        if (value.trim().length === 0) {
          // Re-fetch all books
          try {
            const res = await fetch('/api/books')
            const json = await res.json()
            if (json.success) setBooks(json.data.books)
          } catch { /* silent */ }
          return
        }
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`)
          const json = await res.json()
          if (json.success) setBooks(json.data)
        } catch { /* silent */ }
      }, 400)
    },
    [setSearchQuery, setBooks]
  )

  const handleLogout = () => {
    localStorage.removeItem('bookfriends-user')
    useAppStore.getState().setUser(null)
  }

  const navItems = [
    {
      label: 'My Bookshelf',
      icon: Library,
      action: () => setView('bookshelf'),
    },
    {
      label: 'Add a Book',
      icon: Plus,
      action: () => setView('add-book'),
    },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b z-50 h-16">
      <div className="max-w-[1600px] mx-auto h-full flex items-center gap-4 px-4">
        {/* Logo */}
        <button
          onClick={() => setView('feed')}
          className="flex items-center gap-1 shrink-0"
        >
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-bold text-sm hidden sm:inline">
            <span className="text-primary">Book</span>
            <span style={{ color: '#0d9488' }}>Friends</span>
            <span className="text-primary">.lk</span>
          </span>
        </button>

        {/* Search - hidden on mobile, shown in sheet */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-9 rounded-full bg-secondary/60 border-0 focus-visible:ring-1"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <>
              {/* Desktop nav items */}
              <div className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('bookshelf')}
                  className="text-sm"
                >
                  <Library className="w-4 h-4 mr-1.5" />
                  My Bookshelf
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('add-book')}
                  className="text-sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Book
                </Button>
              </div>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 px-2">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setView('bookshelf')}>
                    <Library className="w-4 h-4 mr-2" />
                    My Bookshelf
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('add-book')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add a Book
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('auth-login')}
                className="hidden sm:inline-flex text-sm"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => setView('auth-register')}
                className="text-sm rounded-full"
              >
                Register
              </Button>
            </>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>
                  <span className="text-primary">Book</span>
                  <span style={{ color: '#0d9488' }}>Friends</span>
                  <span className="text-primary">.lk</span>
                </span>
              </SheetTitle>

              {/* Mobile search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 h-9 rounded-full bg-secondary/60 border-0"
                />
              </div>

              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action()
                    setMobileOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-secondary transition-colors text-sm"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}

              {!user && (
                <>
                  <div className="border-t my-3" />
                  <button
                    onClick={() => {
                      setView('auth-login')
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-secondary transition-colors text-sm"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </button>
                </>
              )}

              {user && (
                <>
                  <div className="border-t my-3" />
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-secondary transition-colors text-sm text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}