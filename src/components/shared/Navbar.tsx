import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const navigationItems = [
  {
    to: "https://2africa.org",
    label: "Home",
    external: true,
  },
  {
    to: "/frontline-fund",
    label: "Frontline Fund",
  },
  {
    to: "/campaigns",
    label: "Campaigns",
  },
  {
    to: "https://www.2africa.org/contact",
    label: "Contact",
    external: true,
  },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAppContext();

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* <span className="text-2xl font-bold text-primary">
              Give to Africa
            </span> */}
            <img src="/give.png" alt="Give to Africa" className="w-16 h-16" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-gray-700 hover:text-brand-purple transition-colors"
                target={item.external ? "_blank" : undefined}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              >
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="mr-2">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
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
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block text-gray-700 hover:text-brand-purple py-2 transition-colors"
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
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" className="w-1/2">
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
