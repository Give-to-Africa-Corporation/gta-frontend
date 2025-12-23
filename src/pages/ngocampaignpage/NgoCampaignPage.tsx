import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { NgoCampaignComp } from "../../components/ngocampaign/NgoCampaignComp";

function NgoCampaignPage() {
  const { state } = useLocation(); // ngo data from search
  const { id } = useParams(); // in case you want to fetch by id later

  if (!state) {
    return <p className="text-center text-gray-500">No NGO data found.</p>;
  }

  return <NgoCampaignComp ngo={state} />;
}

export default NgoCampaignPage;
