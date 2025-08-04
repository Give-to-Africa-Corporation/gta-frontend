import { Card } from "@/components/ui/card";
import { Image as FallbackImage } from "@/components/ui/Image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useRef, useState } from "react";
import { DonationDialog } from "../payments/DonationDialog";

interface TestimonialProps {
  quote: string;
  author: string;
  title: string;
  location: string;
  image: string;
}

const TestimonialCard = ({
  quote,
  author,
  title,
  location,
  image,
}: TestimonialProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 h-[400px]",
          "hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm",
          "focus-within:ring-2 focus-within:ring-primary/50"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="article"
        aria-labelledby={`testimonial-${author
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: isHovered ? 1 : 0, scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <div className="p-8">
          <div className="flex flex-col gap-8">
            <div className="relative">
              <Quote
                className="absolute -top-1 -left-1 text-primary/20 transition-transform duration-300 group-hover:scale-110"
                size={40}
                aria-hidden="true"
              />
              <blockquote
                className="text-lg leading-relaxed pl-8 pt-6 line-clamp-[8]"
                id={`testimonial-${author.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {quote}
              </blockquote>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 absolute -inset-1"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <FallbackImage
                  src={`/images/${image}`}
                  alt={`Portrait of ${author}`}
                  className="w-20 h-20 rounded-full object-cover relative z-10 ring-2 ring-background"
                  fallback="/placeholder.svg"
                />
              </div>
              <footer>
                <div className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {author}
                </div>
                <div className="text-sm text-muted-foreground">
                  {title}
                  <span className="mx-2" aria-hidden="true">
                    •
                  </span>
                  {location}
                </div>
              </footer>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const TestimonialSection = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const testimonials = [
    {
      quote:
        "My team delivers clean water and food during floods. We carry supplies on our backs. We are not on the news. But we are still here.",
      author: "Daniel",
      title: "Safe Haven Founder",
      location: "South Africa",
      image: "daniel.png",
    },
    {
      quote:
        "When foreign aid stopped, I had to let go of two teachers. But the children didn't stop coming. I teach 73 students in a broken classroom with no chalk, no lights… only hope. We are still here.",
      author: "Samson",
      title: "Youth Empowerment Leader",
      location: "Kenya",
      image: "samson.png",
    },
    {
      quote:
        "We run a shelter for survivors of gender-based violence. Some nights, we sleep on the floor with the women because it's safer than outside. We are still here.",
      author: "Fatouma",
      title: "Girls' Education Advocate",
      location: "Mali",
      image: "fatouma.png",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      aria-labelledby="testimonials-title"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background to-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,theme(colors.primary/40)_1px,transparent_0)] bg-[size:40px_40px]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 1 }}
      />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="testimonials-title"
            className="text-4xl md:text-5xl font-bold mb-8 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
          >
            Voices from the Frontline
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Now is the time to fund the communities holding the line. Your
            generosity powers their mission and together we help them carry the
            load.
          </p>
        </motion.div>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          role="list"
          aria-label="Testimonials from frontline workers"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              role="listitem"
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <DonationDialog
            trigger={
              <button
                className={cn(
                  "w-1/4 mx-auto hero-button-frontline text-lg px-8 py-4",
                  "bg-white text-primary hover:bg-white/90 font-bold rounded-xl",
                  "hover:scale-105 transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                )}
                aria-label="Open donation dialog"
              >
                DONATE NOW
              </button>
            }
          />
        </motion.div>

        {/* <div className="text-center mt-12">
          <h3 className="text-2xl md:text-3xl font-bold text-cta mb-4 frontline-testimonial">
            But today, many of them are at a breaking point.
          </h3>

          <div className="mt-8 flex justify-center relative">
            <div className="w-full max-w-2xl aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30 overflow-hidden relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                preload="metadata"
                onEnded={() => setIsPlaying(false)}
                controls={true}
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {!isPlaying && (
                <button
                  onClick={handlePlay}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default TestimonialSection;
