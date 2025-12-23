import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

// Dummy NGOs
const ngos = [
  {
    id: 1,
    name: "Mersal Foundation for Charity and Development",
    country: "Egypt",
    description:
      "High quality medical services for marginalized groups in Cairo and the region.",
    img: "https://res.cloudinary.com/everydotorg/image/upload/f_auto,c_limit,w_256,q_auto/profile_pics/js0izzqnhf9piaq06vfm",
  },
  {
    id: 2,
    name: "Save the Children",
    country: "Global",
    description:
      "Save the Children gives children a healthy start in life, opportunities to learn, and protection from harm.",
    img: "https://www.savethechildren.net/themes/custom/sci_theme/images/sci-logo.svg",
  },
  {
    id: 3,
    name: "Doctors Without Borders",
    country: "Worldwide",
    description:
      "Providing emergency medical aid to people affected by conflict, epidemics, disasters, or exclusion from healthcare.",
    img: "https://www.doctorswithoutborders.org/themes/custom/msf/logo.svg",
  },
  {
    id: 4,
    name: "Islamic Relief Worldwide",
    country: "Worldwide",
    description:
      "Humanitarian organization providing emergency aid, sustainable development, and advocacy.",
    img: "	https://islamic-relief.org/wp-content/themes/irw-andalus/new-assets/images/IRWlogo.png",
  },
  {
    id: 5,
    name: "UNICEF",
    country: "Global",
    description:
      "Working in over 190 countries to save children’s lives, defend their rights, and help them fulfill their potential.",
    img: "https://www.itu.int/net4/wsis/ungis/Content/img/logos/uniform/unicef.png",
  },
  {
    id: 6,
    name: "World Food Programme",
    country: "Global",
    description:
      "The leading humanitarian organization fighting hunger worldwide, delivering food assistance in emergencies.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/World_Food_Programme_Logo_Simple.svg/800px-World_Food_Programme_Logo_Simple.svg.png",
  },
];


export const NgoSearch: FC = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Filter NGOs based on query
  const filteredNgos = ngos.filter((ngo) =>
    ngo.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleOpenNgo = (ngo: any) => {
    navigate(`/ngo-campaigns/${ngo.id}`, { state: ngo });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Search Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3 items-center justify-center">
        <input
          type="text"
          placeholder="Search NGOs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={() => {}}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
        >
          Search
        </button>
      </div>

      {/* NGO Results */}
      {filteredNgos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {filteredNgos.map((ngo) => (
            <div
              key={ngo.id}
              onClick={() => handleOpenNgo(ngo)}
              className="cursor-pointer bg-white rounded-lg shadow p-5 hover:shadow-lg transition border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={ngo.img}
                  alt={ngo.name}
                  className="w-16 h-16 object-contain rounded"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {ngo.name}
                  </h3>
                  <p className="text-sm text-gray-500">{ngo.country}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{ngo.description}</p>
      
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No NGOs found. Try a different search.
        </p>
      )}
    </div>
  );
};
