// @ts-nocheck
import React from "react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import TranslateWrapper from "../googletranslator/TranslateWrapper";
import { ChevronDown, Menu, X, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SearchBarComponent from "./SearchBarComponent";
import logoMain from "../../../public/logo.jfif";

const navigationItems = [
  {
    // to: "https://2africa.org",
    to: "/",
    label: "Home",
    external: false,
  },
  {
    to: "/frontline-fund",
    label: "Frontline Fund",
  },
  {
    to: "/campaigns",
    label: "Causes",
  },
  {
    to: "/contact",
    label: "Contact",
    external: false,
  },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAppContext();

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-primary backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              {/* <span className="text-3xl font-bold text-white">YENDAA</span> */}
              <img src={logoMain} width={90} height="auto" alt="" />
              {/* <img src="/give.png" alt="Campaign to Raising Africa" className="w-16 h-16" /> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          {/* <div className="hidden md:flex items-center space-x-8 m-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-white hover:text-gray-400 transition-colors"
                target={item.external ? "_blank" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div> */}
          <div
            className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-full max-w-[550px]"
            ref={searchRef}
          >
            <SearchBarComponent
              query={query}
              setQuery={setQuery}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>

          <div className="flex items-center space-x-1 ml-auto">
            <Link to="/pricing">
              <Button
                variant="outline"
                size="sm"
                className="mr-0 text-white hover:text-gray-400 text-md"
                style={{ background: "none", border: "none" }}
              >
                Pricing
              </Button>
            </Link>
            {user ? (
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              >
                <Button className="py-3 px-4 bg-brand-yellow text-gray-900 hover:bg-brand-yellow/10 hover:text-white-900" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-0 text-white hover:text-gray-400 text-md"
                    style={{ background: "none", border: "none" }}
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/choose-account">
                  <Button
                    size="sm"
                    className="py-3 px-4 bg-brand-yellow text-gray-900 hover:bg-brand-yellow/10 hover:text-white-900"
                    style={{ borderRadius: "30px" }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:ml-4 ml-auto hidden md:block">
            <TranslateWrapper />
          </div>

          <div className="relative ml-1" ref={dropdownRef}>
            {/* Icon Button */}
            <button
              onClick={() => setOpen(!open)}
              className="p-1 rounded-full hover:bg-gray-500 transition"
            >
              <ChevronDown className="w-6 h-6 text-brand-purple text-white" />
              {/* <MoreVertical className="w-6 h-6 text-brand-purple" /> */}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-xl border border-gray-100 z-50">
                <ul className="py-2 text-sm text-gray-700">
                  <Link to="/faq">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-brand-purple">
                      FAQ & support
                    </li>
                  </Link>
                  <Link to="/choose-account">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-brand-purple">
                      Donate to YENDAA
                    </li>
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <Link to="/aboutus">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-brand-purple">
                      About YENDAA
                    </li>
                  </Link>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-brand-purple">
                    For causes
                  </li>
                  <Link to="/choose-account">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-brand-purple">
                      Signup
                    </li>
                  </Link>
                </ul>
                <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-500 flex flex-wrap gap-x-3">
                  <Link to="/">
                    <span className="cursor-pointer hover:text-gray-700">
                      Home
                    </span>
                  </Link>
                  <Link to="/campaigns">
                    <span className="cursor-pointer hover:text-gray-700">
                      Causes
                    </span>
                  </Link>
                  <Link to="/aboutus">
                    <span className="cursor-pointer hover:text-gray-700">
                      About Us
                    </span>
                  </Link>
                  <Link to="/contact">
                    <span className="cursor-pointer hover:text-gray-700">
                      Contact Us
                    </span>
                  </Link>
                  <Link to="/faq">
                    <span className="cursor-pointer hover:text-gray-700">
                      FAQ
                    </span>
                  </Link>
                  <Link to="/termsuse">
                    <span className="cursor-pointer hover:text-gray-700">
                      Terms
                    </span>
                  </Link>
                  <Link to="/privacypolicy">
                    <span className="cursor-pointer hover:text-gray-700">
                      Privacy
                    </span>
                  </Link>
                  <Link to="https://forms.monday.com/forms/98d7e5c33bc97773bc07f7d1a1e86568?r=use1">
                    <span className="cursor-pointer hover:text-gray-700">
                      Feedback
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          {/* <div className="md:hidden">
            <button onClick={handleMenuToggle} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div> */}
        </div>

        {/* Mobile Menu */}
        {/* {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 mt-2">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block text-white hover:text-gray-400 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
                target={item.external ? "_blank" : undefined}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex space-x-3 pt-2">
                <Link to="/login" className="w-1/2">
                  <Button
                    variant="outline"
                    className="w-full text-white hover:text-gray-400 text-md" style={{ background: "none", border: "none" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" className="w-1/2">
                  <Button
                    className="w-full py-3 px-4" style={{ borderRadius: "30px" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )} */}
      </div>
      <div
        className="block md:hidden pb-3 px-3 relative w-full max-w-[550px] mx-auto"
        ref={searchRef}
      >
        <SearchBarComponent
          query={query}
          setQuery={setQuery}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </nav>
  );
};
