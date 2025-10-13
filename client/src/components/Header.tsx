import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, LogOut } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Link } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-lg font-bold">NM</span>
            </div>
            <span className="font-display text-xl font-bold">NutriMeals</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-how-it-works">
              How It Works
            </Link>
            <Link href="/#plans" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-plans">
              Plans
            </Link>
            <Link href="/#testimonials" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-testimonials">
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              data-testid="button-theme-toggle"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/dashboard">
                  <Avatar className="h-8 w-8" data-testid="avatar-user">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Link>
                <a href="/api/logout">
                  <Button variant="ghost" size="sm" data-testid="button-logout">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </a>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <a href="/api/login">
                  <Button variant="ghost" data-testid="button-login">
                    Log In
                  </Button>
                </a>
                <a href="/api/login">
                  <Button data-testid="button-get-started">
                    Get Started
                  </Button>
                </a>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t" data-testid="mobile-menu">
            <nav className="flex flex-col gap-2">
              <Link href="/#how-it-works" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">
                How It Works
              </Link>
              <Link href="/#plans" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">
                Plans
              </Link>
              <Link href="/#testimonials" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md">
                Testimonials
              </Link>
              {isAuthenticated ? (
                <div className="flex gap-2 mt-2">
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full" data-testid="button-mobile-dashboard">
                      Dashboard
                    </Button>
                  </Link>
                  <a href="/api/logout" className="flex-1">
                    <Button variant="ghost" className="w-full" data-testid="button-mobile-logout">
                      Log Out
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <a href="/api/login" className="flex-1">
                    <Button variant="ghost" className="w-full" data-testid="button-mobile-login">
                      Log In
                    </Button>
                  </a>
                  <a href="/api/login" className="flex-1">
                    <Button className="w-full" data-testid="button-mobile-get-started">
                      Get Started
                    </Button>
                  </a>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
