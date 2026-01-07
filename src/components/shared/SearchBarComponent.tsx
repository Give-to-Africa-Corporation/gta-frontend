// @ts-nocheck
import { useAppContext } from "@/context/AppContext";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SearchBarComponent = () => {
  const { campaigns } = useAppContext();
  console.log(campaigns, "campigns");
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef(null);

  // ---------------------------
  // Campaigns to show
  // ---------------------------
  const results = useMemo(() => {
    if (!campaigns) return [];

    // 🔹 When no query → show latest campaigns
    if (!query.trim()) {
      return [...campaigns]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 6);
    }

    // 🔹 When searching
    return campaigns
      .filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }, [campaigns, query]);

  // ---------------------------
  // Close on outside click
  // ---------------------------
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const causeColors = [
    { bg: "bg-emerald-100", text: "text-emerald-700" },
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-purple-100", text: "text-purple-700" },
    { bg: "bg-orange-100", text: "text-orange-700" },
    { bg: "bg-pink-100", text: "text-pink-700" },
    { bg: "bg-indigo-100", text: "text-indigo-700" },
  ];

  const limitWords = (text, limit = 10) => {
    const words = text?.split(" ");
    return words.length > limit ? words.slice(0, limit).join(" ") + "…" : text;
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      {/* Search Bar */}
      <div
        className={`flex items-center bg-white border px-4 py-3 shadow-sm ${
          isOpen ? "rounded-t-xl" : "rounded-xl"
        }`}
      >
        <button
          onClick={() => setIsOpen((p) => !p)}
          className="mr-2 text-gray-500"
        >
          <Search size={20} />
        </button>

        <input
          type="text"
          placeholder="Search causes..."
          className="flex-1 outline-none text-gray-700"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
        />

        {(query || isOpen) && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
          >
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute border-primary w-full bg-white border rounded-b-xl shadow-xl z-50">
          <div className="p-4">
            <p className="text-xs text-gray-500 font-semibold mb-3">
              {query ? "Search Results" : "Top Causes"}
            </p>

            {results.length === 0 && (
              <p className="text-sm text-gray-400">No causes found</p>
            )}

            <div className="flex flex-wrap gap-2">
              {results.map((c, index) => {
                const color = causeColors[index % causeColors.length];

                return (
                  <div
                    key={c._id}
                    onClick={() => {
                      navigate(`/campaigns/${c.campaignSlug || c._id}`);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer max-w-full"
                  >
                    {/* Image / Icon */}
                    <div
                      className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center overflow-hidden ${color.bg}`}
                    >
                      {c?.media?.mainImage ? (
                        <img
                          src={c.media.mainImage}
                          alt={c.cause}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className={`text-sm font-semibold ${color.text}`}>
                          {c.title?.[0]}
                        </span>
                      )}
                    </div>

                    {/* Text */}
                    <span
                      className={`text-sm ${color.text} mt-[7px] leading-snug break-words`}
                    >
                      {c.cause ? c.cause.split(" ")[0] : ""}
                    </span>
                  </div>
                );
              })}
            </div>

            <Link to="/campaigns" onClick={() => setIsOpen(false)}>
              <button className="w-full text-primary text-left text-sm font-semibold mt-4 hover:underline">
                Explore all Causes
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBarComponent;
