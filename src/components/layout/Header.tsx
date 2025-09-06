'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search will be handled by parent component
    console.log('Search:', searchQuery);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-xl text-green-600">FutMap</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-8 space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-green-600 transition-colors">
            Mapa
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-green-600 transition-colors">
            Dashboard
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-green-600 transition-colors">
            Sobre
          </Link>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-sm mx-8">
          <form onSubmit={handleSearch} className="flex w-full">
            <Input
              type="search"
              placeholder="Buscar campos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" className="ml-2 bg-green-600 hover:bg-green-700">
              Buscar
            </Button>
          </form>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4 ml-auto">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-green-100 text-green-600">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/auth/signup">Cadastrar</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden ml-auto">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <div className="h-4 w-4 flex flex-col justify-between">
                  <div className="h-0.5 w-full bg-current" />
                  <div className="h-0.5 w-full bg-current" />
                  <div className="h-0.5 w-full bg-current" />
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 p-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <Input
                    type="search"
                    placeholder="Buscar campos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                    Buscar
                  </Button>
                </form>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-4">
                  <Link 
                    href="/" 
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mapa
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sobre
                  </Link>
                </nav>

                {/* Mobile Auth */}
                {isAuthenticated && user ? (
                  <div className="border-t pt-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          Perfil
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        Sair
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-6 flex flex-col space-y-3">
                    <Button variant="outline" asChild>
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        Entrar
                      </Link>
                    </Button>
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                        Cadastrar
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}