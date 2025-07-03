
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NewsSection = () => {
  const news = [
    {
      id: 1,
      title: "New Water Project Launches in Rural Kenya",
      excerpt: "Our latest initiative brings clean water to over 5,000 residents in drought-affected regions.",
      date: "April 18, 2025",
      image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Education Program Expands to 10 New Schools",
      excerpt: "The successful literacy program now reaches an additional 2,000 students across Nigeria.",
      date: "April 05, 2025",
      image: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Annual Fundraising Gala Raises Record Amount",
      excerpt: "This year's gala surpassed all expectations, raising over $1.2 million for African initiatives.",
      date: "March 27, 2025",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-green/10 px-4 py-2 rounded-full text-brand-green font-medium text-sm mb-4">
              Latest News
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Stay Updated</h2>
          </div>
          
          <Link to="/news" className="mt-4 md:mt-0">
            <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white">
              View All News
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
                
                <h3 className="font-bold text-xl mb-3 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                
                <Link 
                  to={`/news/${item.id}`}
                  className="text-brand-purple font-medium hover:text-brand-orange transition-colors inline-flex items-center gap-1"
                >
                  Read More
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
