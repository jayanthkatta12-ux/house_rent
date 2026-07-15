import { Link } from "wouter";
import { Bed, Bath, Square } from "lucide-react";
import type { Listing } from "@workspace/api-client-react";
import { PlaceholderImage } from "./PlaceholderImage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const coverImage = listing.images?.[0];

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col border-border/50">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={listing.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PlaceholderImage 
              type={listing.type} 
              city={listing.city} 
              className="w-full h-full transition-transform duration-500 group-hover:scale-105" 
            />
          )}
          
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground hover:bg-background">
              {listing.status === 'available' ? 'Available' : 'Rented'}
            </Badge>
            {listing.featured && (
              <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">
                Featured
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-5 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-xl font-medium line-clamp-1 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-1">
            {listing.address}, {listing.city}, {listing.state}
          </p>
          <div className="text-2xl font-semibold text-primary mb-4">
            {formatCurrency(listing.price)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
          </div>
        </CardContent>
        
        <CardFooter className="px-5 py-4 border-t border-border/50 bg-secondary/30 flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5" title="Bedrooms">
            <Bed className="h-4 w-4" />
            <span>{listing.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5" title="Bathrooms">
            <Bath className="h-4 w-4" />
            <span>{listing.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5" title="Square Footage">
            <Square className="h-4 w-4" />
            <span>{listing.area} sqft</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
