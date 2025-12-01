import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom"; // 👈 import useNavigate

export const RecentDonations = () => {
  const { campaigns } = useAppContext();
  const BASE_URL = "http://localhost:5001";
  const navigate = useNavigate(); // 👈 initialize navigate
  const recent = (campaigns || [])
  .slice() // clone array to avoid mutating original
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // newest first
  .slice(0, 8);

  return (
    <div className="bg-[#2E3333]">
      <div className="container-custom min-h-screen p-4 sm:py-10" id="recent-donations">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {recent.map((item, index) => (
            <Card
              key={item._id || item.id}
              className={`rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col
              ${index % 2 === 0 ? "mt-0" : "mt-8"}`}
              onClick={() =>
                navigate(`/campaigns/${item.campaignSlug || item._id}`) // 👈 whole card click navigates to campaign detail
              }
            >
              {/* Title */}
              <div className="px-4 pt-4">
                <p className="text-sm text-gray-700 line-clamp-1">
                  <span className="font-semibold">{item.cause}</span>
                </p>
              </div>

              {/* Image */}
              <div className="relative h-48 mt-3">
                <img
                  src={item.media?.mainImage ? BASE_URL + item.media.mainImage : item.image || "/placeholder.jpg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title + Description */}
              <CardHeader className="p-4">
                <CardTitle className="text-gray-900 text-lg font-semibold">{item.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{item.country || "Unknown"}</span>
                </div>
                <CardDescription className="text-gray-700 text-sm mt-2 line-clamp-2">
                  {item.short_description || item.description}
                </CardDescription>
              </CardHeader>

              {/* Footer */}
              <CardContent className="mt-auto border-t border-gray-100 p-4 flex items-center justify-between">
                <Button
                  className="bg-brand-purple hover:bg-brand-purple-light text-white rounded-full px-5 py-1 text-sm shadow"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent parent click
                    navigate(`/campaigns/${item.campaignSlug || item._id}/donate`); // 👈 navigate to donate page
                  }}
                >
                  Donate Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
