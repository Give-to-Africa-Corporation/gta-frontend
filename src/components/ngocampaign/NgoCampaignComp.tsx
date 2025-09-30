import { FC, useState } from "react";
import { Share2, Heart, Globe, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

type NgoProps = {
  ngo: {
    id: number;
    name: string;
    country: string;
    website: string;
    description: string;
    img: string;
  };
};

export const NgoCampaignComp: FC<NgoProps> = ({ ngo }) => {
  const [expanded, setExpanded] = useState(false);

  // 🔹 Likes state for header
  const [totalLikes, setTotalLikes] = useState(376);
  const [likedHeader, setLikedHeader] = useState(false);

  // 🔹 Likes state for donors
  const [likedDonors, setLikedDonors] = useState<number[]>([]);

  const donors = [
    { id: 1, name: "Mohamed Ahmed", message: "I am donating this Zakat to support those who are struggling to afford medical care. I pray that my small contribution helps ease someone’s pain and brings relief to their family. May Allah accept it from all of us and multiply the reward.", img: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png" },
    { id: 2, name: "Nesma Elmedany", message: "This donation is in memory of my beloved father. He always believed in helping others and taught me the value of kindness.", img: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png" },
    { id: 3, name: "Ahmed Elsoudy", message: "I believe that every human being deserves proper healthcare, no matter their financial situation.", img: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png" },
    { id: 4, name: "Ahmed Wasfy", message: "Mersal’s mission inspired me to contribute today. I am donating with the intention of supporting life-saving operations, medicine, and awareness campaigns. May this help reach those who are most in need and bring hope into their lives.", img: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png" },
    { id: 5, name: "Lekaa Elhady", message: "Children hold a special place in my heart. Through this donation, I want to support child healthcare programs and make sure that no child suffers due to lack of proper medical care. I am honored to be part of this cause.", img: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png" },
    { id: 6, name: "Hamza Azzam", message: "Healthcare is a basic right and should never be a privilege. I am making this donation to ensure that quality medical services are available to everyone. I pray that my contribution, along with others, makes a meaningful difference.", img: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png" },
  ];

  // 🔹 Share handler
  const handleShare = async () => {
    const shareData = {
      title: "Mersal Foundation",
      text: "Support high quality medical services for marginalized groups.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Campaign link copied to clipboard!");
    }
  };

  // 🔹 Toggle header like
  const toggleHeaderLike = () => {
    if (likedHeader) {
      setTotalLikes(totalLikes - 1);
    } else {
      setTotalLikes(totalLikes + 1);
    }
    setLikedHeader(!likedHeader);
  };

  // 🔹 Toggle donor like
  const toggleDonorLike = (id: number) => {
    setLikedDonors((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-5 rounded-lg shadow mb-6 gap-4">
        {/* NGO Info */}
        <div className="flex items-center gap-4">
          <img
            src="https://res.cloudinary.com/everydotorg/image/upload/f_auto,c_limit,w_256,q_auto/profile_pics/js0izzqnhf9piaq06vfm"
            alt="NGO Logo"
            className="w-14 h-14 rounded"
          />
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">
              Mersal Foundation for Charity and Development
            </h1>
            <p className="text-gray-600 text-sm">
              High quality medical services for marginalized groups in Cairo and the
              region.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Header Like */}
          <button
            onClick={toggleHeaderLike}
            className={`flex items-center gap-1 ${
              likedHeader ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-6 h-6 transition ${
                likedHeader ? "fill-red-500" : ""
              }`}
            />
            <span className="text-sm">{totalLikes}</span>
          </button>

          {/* Donate */}
          <Link
            to="/campaigns/consectetur-debitis/donate"
            className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700"
          >
            Donate
          </Link>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-5">
          <img
            src="https://res.cloudinary.com/everydotorg/image/upload/f_auto,c_limit,w_1920,q_auto/profile_pics/ebj62r4rxyrwdjk9u1az"
            alt="Campaign"
            className="rounded-lg mb-4"
          />

          {/* Always visible content */}
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              Mersal Foundation for Charity and Development is a non-profit
              organization that serves in the health field and works on
              providing all types of healthcare with high quality to whoever is
              in need.
            </p>

            <h3 className="font-bold text-gray-900">Vision</h3>
            <p>
              To be the number one medical organization in Egypt and the Arab
              region and proactive in ensuring the right in healthcare for the
              marginalized groups and those who are in need the most.
            </p>

            {/* Hidden until expanded */}
            {expanded && (
              <>
                <h3 className="font-bold text-gray-900">Message</h3>
                <p>
                  Working on analyzing and filling the gaps of the healthcare
                  system to provide high quality medical services on the basis
                  of equality and dignity through enabling a charitable
                  healthcare system for whoever cannot afford it, as well as
                  contributing to the development of the health sector.
                </p>

                <h3 className="font-bold text-gray-900">Objectives</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Providing medical services to whoever deserves them
                    regardless the cost or for how long they will be needed.
                  </li>
                  <li>
                    Spreading medical awareness in all the places it serves in.
                  </li>
                  <li>
                    Achieving sustainability in funding its activities Core
                    Values.
                  </li>
                  <li>
                    Privacy: Mersal ensures the patient's eligibility to receive
                    its services without hurting their dignity.
                  </li>
                  <li>
                    Healthcare With No Discrimination: Mersal is an open arm to
                    all patients regardless of religion, nationality, color, or
                    language.
                  </li>
                  <li>
                    High Quality: Mersal provides all types of medical services
                    with specialized medical personnel.
                  </li>
                  <li>
                    Credibility and Transparency: Mersal publishes its financial
                    reports and budgets openly.
                  </li>
                </ul>

                <p className="text-gray-500 mt-6">
                  In the past six years, the organization registered over 25,000
                  patients from 27 provinces. Mersal has been seeking to enable
                  access to its services all over the country.
                </p>
              </>
            )}

            {/* Toggle button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-green-600 font-semibold hover:underline block mt-3"
            >
              {expanded ? "Show less" : "Read more"}
            </button>

            {/* 🔹 Divider and Extra Info */}
            <hr className="my-4" />
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span>Egypt</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-600" />
                <a
                  href="https://mersal-ngo.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  mersal-ngo.org
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mt-6 text-sm text-gray-700">
            Mersal Foundation for Charity and Development is hosted at{" "}
            <span className="text-green-600 font-semibold">Myriad USA</span>
          </div>
        </div>

        {/* Right Side Donors */}
        <div className="bg-white rounded-lg shadow p-5 self-start">
          <h3 className="font-bold text-gray-900 mb-4">Donors</h3>
          <div className="space-y-4">
            {donors.map((donor) => (
              <div key={donor.id} className="flex items-center gap-3">
                <img
                  src={donor.img || "https://via.placeholder.com/40/cccccc/ffffff"}
                  alt={donor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{donor.name}</p>
                  {donor.message && (
                    <p className="text-xs text-gray-500 line-clamp-5">
                      {donor.message}
                    </p>
                  )}
                </div>
                <button onClick={() => toggleDonorLike(donor.id)}>
                  <Heart
                    className={`w-5 h-5 cursor-pointer transition ${
                      likedDonors.includes(donor.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <button className="text-green-600 font-semibold hover:underline mt-4">
            View more
          </button>
        </div>
      </div>
    </div>
  );
};
