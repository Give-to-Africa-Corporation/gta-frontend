"use client";
import { Button } from "../ui/button";
import { useAppContext } from "../../context/AppContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAppContext();

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {/* <span className="text-2xl font-bold text-primary">
              Give to Africa
            </span> */}
            <img src="/give.png" alt="Give to Africa" className="w-16 h-16" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-brand-purple transition-colors"
            >
              Home
            </Link>
            <Link
              href="/campaigns"
              className="text-gray-700 hover:text-brand-purple transition-colors"
            >
              Campaigns
            </Link>
            <Link
              href="https://www.2africa.org/contact"
              className="text-gray-700 hover:text-brand-purple transition-colors"
              target="_blank"
            >
              Contact
            </Link>
            {user ? (
              <Link
                href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              >
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="mr-2">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={handleMenuToggle} className="text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 mt-2">
            <Link
              href="/"
              className="block text-gray-700 hover:text-brand-purple py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/campaigns"
              className="block text-gray-700 hover:text-brand-purple py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Campaigns
            </Link>
            <Link
              href="https://www.2africa.org/contact"
              target="_blank"
              className="block text-gray-700 hover:text-brand-purple py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <Link
                href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex space-x-3 pt-2">
                <Link href="/login" className="w-1/2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" className="w-1/2">
                  <Button
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
