import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useState } from 'react';
import { Link } from 'wouter';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" data-testid="button-login">
                Log In
              </Button>
              <Button data-testid="button-get-started">
                Get Started
              </Button>
            </div>

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
              <div className="flex gap-2 mt-2">
                <Button variant="ghost" className="flex-1" data-testid="button-mobile-login">
                  Log In
                </Button>
                <Button className="flex-1" data-testid="button-mobile-get-started">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
