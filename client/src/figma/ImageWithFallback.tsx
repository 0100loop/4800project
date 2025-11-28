import * as React from "react";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = "https://via.placeholder.com/800x600?text=Image",
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = React.useState(false);

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  );
};
