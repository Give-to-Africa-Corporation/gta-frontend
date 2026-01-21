import React, { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { toast, ToastContainer } from "react-toastify";
import { MdEmail, MdFacebook, MdWhatsapp } from "react-icons/md";
import { FaLinkedinIn, FaReddit, FaXTwitter } from "react-icons/fa6";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import apiService from "@/service/apiService";

const campaignApi = apiService.campaignApi;

const LikeButton = ({ item, campaignId }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(item?.likes || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [userIP, setUserIP] = useState(null);

    // Get user IP on component mount
    React.useEffect(() => {
        const fetchUserIP = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                setUserIP(data.ip);
                // console.log("User IP fetched:", data.ip);

                // Check if this IP has already liked this campaign (from localStorage)
                const likedCampaigns = JSON.parse(localStorage.getItem(`likedCampaigns_${data.ip}`) || '[]');
                const hasLiked = likedCampaigns.includes(campaignId);
                setIsLiked(hasLiked);
                // console.log("Has liked this campaign:", hasLiked);
            } catch (error) {
                console.error("Failed to fetch user IP:", error);
                setUserIP("unknown");
            }
        };

        fetchUserIP();
    }, [campaignId]);

    const handleLike = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        // console.log("❤️ Like/Unlike button clicked!");
        // console.log("campaignId:", campaignId);
        // console.log("userIP:", userIP);
        // console.log("isLiked:", isLiked);

        if (isLoading) {
            console.log("Already loading, skipping...");
            return;
        }

        try {
            setIsLoading(true);

            if (isLiked) {
                // Unlike
                // console.log("Making API call to unlikeCampaign...");
                const response = await campaignApi.unlikeCampaign(campaignId, userIP || "unknown");

                // console.log("✅ Unlike response:", response);

                if (response.success && response.data) {
                    setIsLiked(false);
                    setLikeCount(response.data.likes);

                    // Remove from localStorage
                    const likedCampaigns = JSON.parse(localStorage.getItem(`likedCampaigns_${userIP}`) || '[]');
                    const updated = likedCampaigns.filter(id => id !== campaignId);
                    localStorage.setItem(`likedCampaigns_${userIP}`, JSON.stringify(updated));

                    toast.success("You unliked this campaign!");
                } else {
                    console.log("❌ API error:", response.error);
                    toast.error(response.error || "Failed to unlike campaign");
                }
            } else {
                // Like
                console.log("Making API call to likeCampaign...");
                const response = await campaignApi.likeCampaign(campaignId, userIP || "unknown");

                // console.log("✅ Like response:", response);

                if (response.success && response.data) {
                    setIsLiked(true);
                    setLikeCount(response.data.likes);

                    // Add to localStorage
                    const likedCampaigns = JSON.parse(localStorage.getItem(`likedCampaigns_${userIP}`) || '[]');
                    if (!likedCampaigns.includes(campaignId)) {
                        likedCampaigns.push(campaignId);
                    }
                    localStorage.setItem(`likedCampaigns_${userIP}`, JSON.stringify(likedCampaigns));

                    toast.success("You liked this campaign!");
                } else {
                    console.log("❌ API error:", response.error);
                    toast.error(response.error || "Failed to like campaign");
                }
            }
        } catch (error) {
            console.error("❌ Error:", error);
            toast.error("Failed to process your request");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLoading}
            className="cursor-pointer transition-all duration-200 hover:scale-110 flex items-center gap-1"
            title="Like this campaign"
        >
            {isLiked ? (
                <FaHeart className="w-6 h-6 text-primary" />
            ) : (
                <FaRegHeart className="w-6 h-6 text-primary hover:text-primary" />
            )}
            {likeCount > 0 && <span className="text-xs text-gray-600">{likeCount}</span>}
        </button>
    );
};

const ShareButton = ({ item }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    const shareUrl = `${window.location.origin}/campaigns/${item.campaignSlug || item._id}`;
    const shareText = encodeURIComponent(item.title || "");

    const handleCopy = (shareUrl) => {
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                toast.success("Copied to clipboard!");
            })
            .catch(() => {
                toast.error("Failed to copy!");
            });
    };

    const onEnter = () => {
        clearTimeout(timeoutRef.current);
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setPos({
            top: rect.top,
            left: rect.left + rect.width / 0.2,
        });
        setOpen(true);
    };

    const onLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 150);
    };

    return (
        <>
            <div
                ref={ref}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer relative"
            >
                {/* Share Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="text-primary"
                >
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"></path>
                </svg>

                {open &&
                    createPortal(
                        <div
                            ref={dropdownRef}
                            style={{
                                position: "fixed",
                                top: pos.top - 5,
                                left: pos.left,
                                transform: "translate(-50%, -100%)",
                            }}
                            className="absolute 
                        left-1/2 
                        -translate-x-1/2 
                        -top-2 
                        -translate-y-full 
                        w-64 
                        bg-white 
                        rounded-2xl 
                        shadow-xl 
                        p-4 
                        z-50"
                            onMouseEnter={onEnter}
                            onMouseLeave={onLeave}
                        >
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <button className="flex gap-2 items-center" onClick={() => window.open(`mailto:?body=${shareUrl}`)}><MdEmail className="w-8 h-8 bg-gray-200 p-2 rounded-full " /> Email</button>
                                <button className="flex gap-2 items-center" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)}><MdFacebook className="w-8 h-8 bg-gray-200 p-2 rounded-full " /> Facebook</button>
                                <button className="flex gap-2 items-center" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`)}><FaXTwitter className="w-8 h-8 bg-gray-200 p-2 rounded-full " /> X</button>
                                <button className="flex gap-2 items-center" onClick={() => window.open(`https://wa.me/?text=${shareUrl}`)}><MdWhatsapp className="w-8 h-8 bg-gray-200 p-2 rounded-full " /> WhatsApp</button>
                                <button className="flex gap-2 items-center" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`)}><FaLinkedinIn className="w-8 h-8 bg-gray-200 p-2 rounded-full " /> LinkedIn</button>
                                <button className="flex gap-2 items-center" onClick={() => window.open(`https://www.reddit.com/submit?url=${shareUrl}`)}><FaReddit className="w-8 h-8 bg-gray-200 p-2 rounded-full " /> Reddit</button>
                            </div>

                            <button
                                onClick={() => handleCopy(shareUrl)}
                                className="mt-4 w-full border border-emerald-500 text-emerald-600 py-2 rounded-full"
                            >
                                🔗 Copy link
                            </button>
                        </div>,
                        document.body
                    )}
            </div>
        </>
    );
};

export const RecentDonations = () => {
    const { campaigns } = useAppContext();
    // console.log(campaigns, "campaigns...")
    const navigate = useNavigate();

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied!");
    };

    // Take the 8 most recent campaigns
    const recent = useMemo(() => {
        return (campaigns || [])
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 16);
    }, [campaigns]);

    const getResolvedImage = (item) => {
        const imageUrl = item.media?.mainImage || item.image || "/placeholder.jpg";
        return imageUrl.startsWith("http")
            ? imageUrl
            : `${import.meta.env.VITE_BE_URL}${imageUrl}`;
    };

    const getResolvedprofileImage = (item) => {
        const imageUrl = item.ngoId?.profileImage || "/placeholder.jpg";
        return imageUrl.startsWith("http")
            ? imageUrl
            : `${import.meta.env.VITE_BE_URL}${imageUrl}`;
    };

    return (
        <div className="bg-[#2E3333] py-12" style={{ backgroundColor: "#2E3333" }}>
            <div className="container-custom min-h-screen p-4 sm:py-10" id="recent-donations">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                    {recent.map((item, index) => {
                        // console.log("Campaign item:", item);
                        return (
                            <Card
                                key={item._id || item.id}
                                className={`group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col
              ${index % 2 === 0 ? "mt-0" : "mt-8"} cursor-pointer`}
                                onClick={() =>
                                    navigate(`/campaigns/${item.campaignSlug || item._id}`)
                                }
                            >
                                <div className="px-4 py-3">
                                    {/* Top Row */}
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        {item?.ngoId?.profileImage ? (
                                            <img
                                                src={getResolvedprofileImage(item)}
                                                alt={item?.ngoId?.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-700 font-semibold text-md uppercase">
                                                    {item?.ngoId?.name?.charAt(0)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Name + Donation */}
                                        <div className="flex flex-col">
                                            <p className="text-gray-800 font-medium text-sm">
                                                {item?.ngoId?.name}
                                            </p>
                                            {/* <span className="text-gray-500 text-xs">
                                            donated • {item?.pendingPayments?.length}
                                        </span> */}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <CardDescription className="text-gray-700 text-sm mt-2 line-clamp-2" dangerouslySetInnerHTML={{
                                        __html: item.short_description || item.description,
                                    }}>
                                        {/* {item.short_description || item.description} */}
                                    </CardDescription>
                                </div>

                                {/* Image Section with overlay */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={getResolvedImage(item)}
                                        alt={item.title}
                                        className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Overlay badge */}
                                    {/* <div className="absolute bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    {item.cause}
                                </div> */}
                                </div>

                                {/* Card Content */}
                                <CardHeader className="p-4" style={{ backgroundColor: `${item?.color}` }}>
                                    <CardTitle className="text-gray-900 text-lg font-semibold line-clamp-1">{item.title}</CardTitle>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        {/* <MapPin className="h-4 w-4 mr-1" />
                                    <span>{item.country || "Unknown"}</span> */}
                                        {item.cause}
                                    </div>
                                    <CardDescription className="text-gray-700 text-sm mt-2 line-clamp-2" dangerouslySetInnerHTML={{
                                        __html: item.short_description || item.description,
                                    }}>
                                        {/* {item.short_description || item.description} */}
                                    </CardDescription>
                                </CardHeader>

                                {/* Footer */}
                                <CardContent className="relative overflow-visible mt-auto border-t border-gray-100 p-4 flex items-center justify-between">
                                    <div className="flex gap-3">
                                        <ShareButton item={item} />
                                        <LikeButton item={item} campaignId={item._id || item.id} />
                                    </div>
                                    <Button
                                        className="bg-brand-purple hover:bg-brand-purple-light text-white rounded-full px-5 py-1 text-sm shadow"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/campaigns/${item.campaignSlug || item._id}/donate`);
                                        }}
                                    >
                                        Donate
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                {/* Show More Button */}
                {recent?.length > 16 ?
                    <div className="flex justify-center mt-10">
                        <Button
                            className="bg-brand-purple hover:bg-brand-purple-light text-white rounded-full px-6 py-2 text-sm shadow"
                            onClick={() => navigate("/campaigns")}
                        >
                            Show More
                        </Button>
                    </div> : ""
                }
            </div>
        </div>
    );
};
