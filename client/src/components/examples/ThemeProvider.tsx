import { ThemeProvider } from '../ThemeProvider'
import { useTheme } from '../ThemeProvider'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

function ThemeToggleExample() {
  const { theme, setTheme } = useTheme()
  
  return (
    <div className="p-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        data-testid="button-theme-toggle"
      >
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">Current theme: {theme}</p>
    </div>
  )
}

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <ThemeToggleExample />
    </ThemeProvider>
  )
}
