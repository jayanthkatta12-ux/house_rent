import { Link, useLocation } from "wouter";
import { Home, Building, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Building className="h-6 w-6" />
          <span className="font-serif font-semibold text-xl tracking-tight">NestFinder</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/listings" 
            className={`text-sm font-medium transition-colors hover:text-primary ${location === '/listings' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Browse Homes
          </Link>
          <div className="w-px h-4 bg-border" />
          <Link href="/admin">
            <Button variant={location.startsWith('/admin') ? "secondary" : "ghost"} size="sm" className="gap-2">
              <UserCircle className="h-4 w-4" />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
