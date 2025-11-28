import React from "react";

type ImageWithFallbackProps = {
  src?: string;
  alt: string;
  className?: string;
};

const FALLBACK =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=60";

export function ImageWithFallback({ src, alt, className }: ImageWithFallbackProps) {
  const [error, setError] = React.useState(false);

  const imgSrc = !error && src ? src : FALLBACK;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
