import { Card } from "@/components/ui/card";
import React, { useRef, useState } from 'react';
import { Quote } from "lucide-react";
import video from "./../../../public/images/video.mp4";

interface TestimonialProps {
  quote: string;
  author: string;
  title: string;
  location: string;
}

const TestimonialCard = ({ quote, author, title, location }: TestimonialProps) => (
  <Card className="quote-card">
    <div className="flex items-start gap-4">
      <Quote className="text-primary flex-shrink-0 mt-1" size={24} />
      <div>
        <blockquote className="text-lg leading-relaxed mb-4 italic">
          "{quote}"
        </blockquote>
        <footer className="text-sm font-semibold">
          <div className="text-foreground">— {author}</div>
          <div className="text-muted-foreground">{title}, {location}</div>
        </footer>
      </div>
    </div>
  </Card>
);

const TestimonialSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };
  const testimonials = [
    {
      quote: "My team delivers clean water and food during floods. We carry supplies on our backs. We are not on the news. But we are still here.",
      author: "Daniel",
      title: "Safe Haven Founder",
      location: "South Africa"
    },
    {
      quote: "When foreign aid stopped, I had to let go of two teachers. But the children didn't stop coming. I teach 73 students in a broken classroom with no chalk, no lights… only hope. We are still here.",
      author: "Samson",
      title: "Youth Empowerment Leader",
      location: "Kenya"
    },
    {
      quote: "We run a shelter for survivors of gender-based violence. Some nights, we sleep on the floor with the women because it's safer than outside. We are still here.",
      author: "Fatouma",
      title: "Girls' Education Advocate",
      location: "Mali"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-secondary/30 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Voices from the Frontline
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Now is the time to fund the communities holding the line. Your generosity powers their mission and together we help them carry the load.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex">
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <h3 className="text-2xl md:text-3xl font-bold text-cta mb-4 frontline-testimonial">
            But today, many of them are at a breaking point.
          </h3>
          
          {/* YouTube Video Placeholder */}
          <div className="mt-8 flex justify-center relative">
      <div className="w-full max-w-2xl aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30 overflow-hidden relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          preload="metadata"
          onEnded={() => setIsPlaying(false)}
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
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;