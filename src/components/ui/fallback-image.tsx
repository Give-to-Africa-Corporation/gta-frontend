import { FALLBACK_IMAGE } from "@/lib/utils";
import React, { useEffect } from "react";

/**
 * A component that sets up global image fallbacks
 * This should be rendered once at the app root level
 */
export const GlobalImageFallbacks: React.FC = () => {
  useEffect(() => {
    // Set up global handler for all image errors
    const handleGlobalImageError = (event: Event) => {
      const img = event.target as HTMLImageElement;

      // Skip if img already has our fallback or data-no-fallback attribute
      if (img.src === FALLBACK_IMAGE || img.hasAttribute("data-no-fallback")) {
        return;
      }

      // Set the fallback image
      console.warn(`Image failed to load: ${img.src}`);
      img.src = FALLBACK_IMAGE;
    };

    // Add the event listener
    document.addEventListener("error", handleGlobalImageError, true);

    // Clean up
    return () => {
      document.removeEventListener("error", handleGlobalImageError, true);
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default GlobalImageFallbacks;
