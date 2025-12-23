// @ts-nocheck
import { useAppContext } from "@/context/AppContext";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const SearchBarComponent = ({ query, setQuery, isOpen, setIsOpen }) => {
  const { campaigns } = useAppContext();
  const navigate = useNavigate();

  // Take the 8 most recent campaigns
const filteredCampaigns = useMemo(() => {
  if (!query) return [];
  return (campaigns || [])
    .filter((c) =>
      c.title.toLowerCase().includes(query.toLowerCase())
    )
    .slice()
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);
}, [campaigns, query]);

const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);


  return (
    <>
      <div ref={ref} className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-4">
        <Search size={20} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search causes, people..."
          className="flex-1 outline-none text-gray-700"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button onClick={() => setQuery("")}>
            <X size={22} className="text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && query && (
        <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="p-5">
            <h4 className="text-xs font-semibold text-gray-500 mb-3">
              Causes
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {filteredCampaigns.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                  onClick={() => {
                    navigate(`/campaigns/${name.campaignSlug || name._id}`)
                    setIsOpen(false);
                  } }
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm"></span>
                  </div>
                  <span className="text-sm">{name.title}</span>
                </div>
              ))}
            </div>

            {/* <h4 className="text-xs font-semibold text-gray-500 mb-3">PEOPLE</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Courtney Gatter",
                "David Gatter",
                "Chris Gathercole",
                "Egide Gatera",
              ].map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-gray-700 text-sm font-semibold">
                      {name[0]}
                    </span>
                  </div>
                  <span className="text-sm">{name}</span>
                </div>
              ))}
            </div> */}

            <Link to="/campaigns" onClick={() => setIsOpen(false)}><button className="w-full text-emerald-700 text-sm font-semibold mt-4 hover:underline">
              View all results
            </button></Link>
          </div>
        </div>
      )}
    </>
  );

};

export default SearchBarComponent;
