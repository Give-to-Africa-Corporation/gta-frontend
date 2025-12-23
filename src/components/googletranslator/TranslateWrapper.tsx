import { useEffect, useState } from "react";
import "./translateWrapper.css";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const TranslateWrapper: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const cleanupGoogleWidget = () => {
    const el = document.getElementById("google_translate_element");
    if (el) el.innerHTML = "";

    document
      .querySelectorAll("body > .skiptranslate, body > iframe")
      .forEach((node) => node.remove());

    document.body.style.top = "";

    const oldScript = document.getElementById("google-translate-script");
    if (oldScript) oldScript.remove();

    delete window.googleTranslateElementInit;

    if (window.google?.translate) {
      delete window.google.translate;
    }
  };

  const loadAndInit = () => {
    cleanupGoogleWidget();

    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,af",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
        setIsLoaded(true);
      }
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadAndInit();

    return () => {
      cleanupGoogleWidget(); // unmount pe cleanup
    };
  }, []);

  return (
    <div>
      {!isLoaded && <div className="skeleton-box"></div>}
      <div id="google_translate_element"></div>
    </div>
  );
};

export default TranslateWrapper;
