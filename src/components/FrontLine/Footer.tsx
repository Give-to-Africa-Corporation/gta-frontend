import { Button } from "@/components/ui/button";
import { Heart, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-muted to-secondary section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Organization Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-primary" size={24} />
              <span className="text-xl font-bold text-foreground">Campaign to Raising Africa</span>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Connecting everyday donors with extraordinary African-led organizations to create lasting change across the continent.
            </p>
            <div className="flex gap-3">
              <Button size="sm" variant="outline" className="p-2">
                <Facebook size={16} />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Twitter size={16} />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Mail size={16} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["About Us", "Our Mission", "Impact Stories", "Partners", "Blog"].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Get Involved</h3>
            <ul className="space-y-2">
              {["Donate Now", "Volunteer", "Fundraise", "Corporate Partners", "Newsletter"].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary flex-shrink-0 mt-1" size={16} />
                <p className="text-muted-foreground text-sm">
                  123 Impact Street<br />
                  Global City, GC 12345
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary flex-shrink-0" size={16} />
                <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-primary flex-shrink-0" size={16} />
                <p className="text-muted-foreground text-sm">info@givetoafrica.org</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="border-t border-border/50 pt-8 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">Share this page:</h3>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Facebook size={16} />
                Facebook
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Twitter size={16} />
                X (Twitter)
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border/50 pt-8 text-center">
          <p className="text-muted-foreground text-sm mb-2">
            © 2024 Campaign to Raising Africa. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Campaign to Raising Africa is a 501(c)(3) nonprofit organization. Tax ID: 12-3456789
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;