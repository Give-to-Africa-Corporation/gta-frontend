import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/shared/Navbar";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Give to Africa",
  description: "Support African causes and make a difference",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <AppProvider>
            <TooltipProvider>
              <Navbar />
              {children}
            </TooltipProvider>
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}
