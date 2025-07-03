import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Default fallback image for when images fail to load
export const FALLBACK_IMAGE =
  "https://placehold.co/600x400?text=No+Image+Available";

// Helper function to check if an image URL is valid or use a fallback
export async function getValidImageUrl(
  url?: string,
  fallback = FALLBACK_IMAGE
): Promise<string> {
  if (!url) return fallback;

  try {
    // For data URLs, just return them
    if (url.startsWith("data:")) return url;

    // For blob URLs created by URL.createObjectURL, we can't check them with fetch
    if (url.startsWith("blob:")) return url;

    // For relative paths, assuming they're in the public folder or handled by the backend
    if (url.startsWith("/")) {
      // If it's an API URL that needs to be prefixed
      if (url.startsWith("/uploads/") && process.env.NEXT_PUBLIC_API_URL) {
        return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
      }
      return url;
    }

    // For full URLs, check if they're valid
    await fetch(url, { method: "HEAD" });
    return url;
  } catch (error) {
    console.warn(`Image failed to load: ${url}`, error);
    return fallback;
  }
}
