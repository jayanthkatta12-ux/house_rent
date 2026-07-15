interface PlaceholderImageProps {
  type: string;
  city: string;
  className?: string;
}

export function PlaceholderImage({ type, city, className = "" }: PlaceholderImageProps) {
  return (
    <div className={`flex flex-col items-center justify-center bg-secondary text-secondary-foreground overflow-hidden ${className}`}>
      <span className="font-serif text-2xl opacity-40 capitalize mb-1">{type}</span>
      <span className="font-sans text-sm font-medium tracking-widest uppercase opacity-60">{city}</span>
    </div>
  );
}
