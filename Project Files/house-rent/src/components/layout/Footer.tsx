import { Building } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building className="h-6 w-6" />
              <span className="font-serif font-semibold text-xl tracking-tight">NestFinder</span>
            </Link>
            <p className="text-primary-foreground/80 max-w-sm">
              Discover your next perfect home. A curated selection of premium apartments, houses, and townhomes designed for modern living.
            </p>
          </div>
          <div>
            <h4 className="font-serif font-medium text-lg mb-4">Explore</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><Link href="/listings?type=apartment" className="hover:text-white transition-colors">Apartments</Link></li>
              <li><Link href="/listings?type=house" className="hover:text-white transition-colors">Houses</Link></li>
              <li><Link href="/listings?type=townhouse" className="hover:text-white transition-colors">Townhomes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-medium text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
          © {new Date().getFullYear()} NestFinder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
