import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const donations = [
    {
        id: 1,
        donor: "Alex Baldwin",
        donated: "x13",
        text: "The team at the Scientific station and the communities they come from around the cloud forest have given the better part of 4 decades of their...",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        title: "Los Cedros Fund",
        location: "Ecuador",
        description: "An endowment protecting the Los Cedros cloud forest forever.",
        joined: 4,
        likes: 4,
    },
    {
        id: 2,
        donor: "Flemming D C",
        donated: "x19",
        text: "This seems to be a high scale and very neglected area.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        title: "Fish Welfare Initiative",
        location: "Normal, IL",
        description: "FWI reduces the suffering of farmed fish by researching and executing evidence-based interventions in high-priority contexts.",
        joined: 2,
        likes: 4,
    },
    {
        id: 3,
        donor: "Heather Rangel",
        donated: "x11",
        text: "No End To Love is changing the lives of families in Kenya, one family and village at a time.",
        image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6",
        title: "No End To Love Inc.",
        location: "South Jordan, UT",
        description: "Building self-reliant communities — one family, one village at a time.",
        joined: 2,
        likes: 3,
    },
    {
        id: 4,
        donor: "Brian Higdon",
        donated: "x27",
        text: "Nuclear weapons are an existential risk to humanity's forward progress.",
        image: "https://images.unsplash.com/photo-1497493292307-31c376b6e479",
        title: "Nuclear Threat Initiative",
        location: "Washington, DC",
        description: "Building a safer world through advocacy and awareness.",
        joined: 3,
        likes: 3,
    },
    {
        id: 5,
        donor: "Brian Higdon",
        donated: "x27",
        text: "Nuclear weapons are an existential risk to humanity's forward progress.",
        image: "https://images.unsplash.com/photo-1497493292307-31c376b6e479",
        title: "Nuclear Threat Initiative",
        location: "Washington, DC",
        description: "Building a safer world through advocacy and awareness.",
        joined: 3,
        likes: 3,
    },
    {
        id: 6,
        donor: "Brian Higdon",
        donated: "x27",
        text: "Nuclear weapons are an existential risk to humanity's forward progress.",
        image: "https://images.unsplash.com/photo-1497493292307-31c376b6e479",
        title: "Nuclear Threat Initiative",
        location: "Washington, DC",
        description: "Building a safer world through advocacy and awareness.",
        joined: 3,
        likes: 3,
    },
    {
        id: 7,
        donor: "Brian Higdon",
        donated: "x27",
        text: "Nuclear weapons are an existential risk to humanity's forward progress.",
        image: "https://images.unsplash.com/photo-1497493292307-31c376b6e479",
        title: "Nuclear Threat Initiative",
        location: "Washington, DC",
        description: "Building a safer world through advocacy and awareness.",
        joined: 3,
        likes: 3,
    },
];

export const RecentDonations = () => {
    return (
        <div className="bg-[#2E3333]">
            <div className="container-custom min-h-screen p-4 sm:py-10" id="recent-donations">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                    {donations.map((item, index) => (
                        <Card
                            key={item.id}
                            className={`rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col
        ${index % 2 === 0 ? "mt-0" : "mt-8"}
        `}
                        >
                            {/* Donor Header */}
                            <div className="px-4 pt-4">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">{item.donor}</span>{" "}
                                    <span className="text-gray-500">donated {item.donated}</span>
                                </p>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.text}</p>
                            </div>

                            {/* Image */}
                            <div className="relative h-48 mt-3">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Title + Description */}
                            <CardHeader className="p-4">
                                <CardTitle className="text-gray-900 text-lg font-semibold">{item.title}</CardTitle>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{item.location}</span>
                                </div>
                                <CardDescription className="text-gray-700 text-sm mt-2 line-clamp-2">
                                    {item.description}
                                </CardDescription>
                            </CardHeader>

                            {/* Footer */}
                            <CardContent className="mt-auto border-t border-gray-100 p-4 flex items-center justify-between">
                                {/* <div className="flex items-center gap-4 text-gray-600 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-4 h-4 text-emerald-600" /> {item.likes}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-emerald-600" /> {item.joined} joined
                                    </div>
                                </div> */}
                                <Button className="bg-brand-purple hover:bg-brand-purple-light text-white rounded-full px-5 py-1 text-sm shadow">
                                    Donate
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
