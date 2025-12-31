// @ts-nocheck
import { useAppContext } from "@/context/AppContext";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SearchBarComponent = () => {
  const { campaigns } = useAppContext();
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

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      {/* Search Bar */}
      <div className="flex items-center bg-white border rounded-xl px-4 py-3 shadow-sm">
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
        <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-xl z-50">
          <div className="p-4">
            <p className="text-xs text-gray-500 font-semibold mb-3">
              {query ? "Search Results" : "Latest Causes"}
            </p>

            {results.length === 0 && (
              <p className="text-sm text-gray-400">No causes found</p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-5">
              {results.map((c) => (
                <div
                  key={c._id}
                  onClick={() => {
                    navigate(`/campaigns/${c.campaignSlug || c._id}`);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                    {c?.mainImage ? (
                      <img
                        src={c.mainImage}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-emerald-700 text-sm font-semibold">
                        {c.title?.[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{c.title}</span>
                </div>
              ))}
            </div>
            <Link to="/campaigns" onClick={() => setIsOpen(false)}>
              <button className="w-full text-emerald-700 text-sm font-semibold mt-4 hover:underline">
                View all results
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBarComponent;
