import { cn, FALLBACK_IMAGE } from "@/lib/utils";
import { ImgHTMLAttributes, useState } from "react";

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  alt: string;
}

export const Image = ({
  src,
  alt,
  fallback = FALLBACK_IMAGE,
  className,
  ...props
}: ImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc || fallback}
      alt={alt}
      onError={handleError}
      className={cn("object-cover", className)}
      {...props}
    />
  );
};

export default Image;
