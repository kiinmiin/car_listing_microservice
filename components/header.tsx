'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  currentPage?: 'home' | 'browse' | 'sell' | 'premium' | 'car' | 'dashboard' | 'contact';
}

export function Header({ currentPage }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getNavLinkClass = (page: string) => {
    const baseClass = "transition-colors";
    if (currentPage === page) {
      return `${baseClass} text-primary font-medium`;
    }
    return `${baseClass} text-foreground hover:text-primary`;
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-foreground">CarMarket</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/browse" className={getNavLinkClass('browse')}>
              Browse Cars
            </Link>
            <Link href="/sell" className={getNavLinkClass('sell')}>
              Sell Your Car
            </Link>
            <Link href="/premium" className={getNavLinkClass('premium')}>
              Premium Listings
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className={getNavLinkClass('dashboard')}>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Dashboard
                  </Button>
                </Link>
                <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="bg-transparent"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
