import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

export const RecentDonations = () => {
    const { campaigns } = useAppContext();
    console.log(campaigns, "campaigns...")
    const navigate = useNavigate();

    // Take the 8 most recent campaigns
    const recent = useMemo(() => {
        return (campaigns || [])
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 8);
    }, [campaigns]);

    const getResolvedImage = (item) => {
        const imageUrl = item.media?.mainImage || item.image || "/placeholder.jpg";
        return imageUrl.startsWith("http")
            ? imageUrl
            : `${import.meta.env.VITE_BE_URL}${imageUrl}`;
    };

    return (
        <div className="bg-[#2E3333]">
            <div className="container-custom min-h-screen p-4 sm:py-10" id="recent-donations">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                    {recent.map((item, index) => (
                        <Card
                            key={item._id || item.id}
                            className={`group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col
              ${index % 2 === 0 ? "mt-0" : "mt-8"} cursor-pointer`}
                            onClick={() =>
                                navigate(`/campaigns/${item.campaignSlug || item._id}`)
                            }
                        >
                            {/* Image Section with overlay */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={getResolvedImage(item)}
                                    alt={item.title}
                                    className="h-full w-full object-cover rounded-t-2xl transform group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Overlay badge */}
                                <div className="absolute bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    {item.cause}
                                </div>
                            </div>

                            {/* Card Content */}
                            <CardHeader className="p-4">
                                <CardTitle className="text-gray-900 text-lg font-semibold line-clamp-1">{item.title}</CardTitle>
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
                                        e.stopPropagation();
                                        navigate(`/campaigns/${item.campaignSlug || item._id}/donate`);
                                    }}
                                >
                                    Donate Now
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {/* Show More Button */}
                <div className="flex justify-center mt-10">
                    <Button
                        className="bg-brand-purple hover:bg-brand-purple-light text-white rounded-full px-6 py-2 text-sm shadow"
                        onClick={() => navigate("/campaigns")}
                    >
                        Show More
                    </Button>
                </div>
            </div>
        </div>
    );
};
