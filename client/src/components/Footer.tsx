import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-lg font-bold">NM</span>
              </div>
              <span className="font-display text-xl font-bold">NutriMeals</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Personalized nutrition delivered to your door
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" data-testid="button-facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-linkedin">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold" data-testid="text-footer-company">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">About Us</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-careers">Careers</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-blog">Blog</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold" data-testid="text-footer-plans">Plans</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/clinical-plan" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-clinical">Premium Clinical</Link></li>
              <li><Link href="/ai-plan" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-ai">AI-Assisted</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold" data-testid="text-footer-support">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-faq">FAQ</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">Contact</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 NutriMeals. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-64"
                data-testid="input-newsletter"
              />
              <Button data-testid="button-subscribe">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
