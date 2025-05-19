import React, { useState } from "react";
import axios from "axios";

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [adsets, setAdsets] = useState([]);
  const [ads, setAds] = useState([]);
  const [insightsCountry, setInsightsCountry] = useState([]);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("http://localhost:3001/campaigns");
      setCampaigns(res.data);
    } catch (err) {
      console.error("Gagal fetch campaigns:", err);
    }
  };

  const fetchAdsets = async () => {
    try {
      const res = await axios.get("http://localhost:3001/adsets");
      setAdsets(res.data);
    } catch (err) {
      console.error("Gagal fetch adsets:", err);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await axios.get("http://localhost:3001/ads");
      setAds(res.data);
    } catch (err) {
      console.error("Gagal fetch ads:", err);
    }
  };

  const fetchInsightsWithCountryBreakdown = async () => {
    try {
      const res = await axios.get("http://localhost:3001/insights?breakdowns=country");
      setInsightsCountry(res.data);
    } catch (err) {
      console.error("Gagal fetch insights per negara:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 font-semibold";
      case "PAUSED":
        return "text-yellow-600 font-semibold";
      case "ARCHIVED":
        return "text-gray-500";
      default:
        return "";
    }
  };

  const Section = ({ title, children }) => (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Facebook Marketing Dashboard</h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={fetchCampaigns} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ambil Campaigns</button>
          <button onClick={fetchAdsets} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Ambil Ad Sets</button>
          <button onClick={fetchAds} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Ambil Ads</button>
          <button onClick={fetchInsightsWithCountryBreakdown} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">Breakdown Negara</button>
        </div>

        {/* Campaigns */}
        {campaigns.length > 0 && (
          <Section title="Campaigns">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-blue-600 text-white uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Tujuan</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp, idx) => (
                  <tr key={camp.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                    <td className="px-5 py-2 font-mono">{camp.id}</td>
                    <td className="px-5 py-2">{camp.name}</td>
                    <td className={`px-5 py-2 ${getStatusColor(camp.status)}`}>{camp.status}</td>
                    <td className="px-5 py-2">{camp.objective}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {/* Ad Sets */}
        {adsets.length > 0 && (
          <Section title="Ad Sets">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-indigo-600 text-white uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Campaign ID</th>
                  <th className="px-5 py-3">Anggaran</th>
                </tr>
              </thead>
              <tbody>
                {adsets.map((adset, idx) => (
                  <tr key={adset.id} className={idx % 2 === 0 ? "bg-white" : "bg-indigo-50"}>
                    <td className="px-5 py-2 font-mono">{adset.id}</td>
                    <td className="px-5 py-2">{adset.name}</td>
                    <td className={`px-5 py-2 ${getStatusColor(adset.status)}`}>{adset.status}</td>
                    <td className="px-5 py-2 font-mono">{adset.campaign_id}</td>
                    <td className="px-5 py-2">{adset.daily_budget || adset.lifetime_budget || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {/* Ads */}
        {ads.length > 0 && (
          <Section title="Ads">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-purple-600 text-white uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Ad Set ID</th>
                  <th className="px-5 py-3">Creative</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad, idx) => (
                  <tr key={ad.id} className={idx % 2 === 0 ? "bg-white" : "bg-purple-50"}>
                    <td className="px-5 py-2 font-mono">{ad.id}</td>
                    <td className="px-5 py-2">{ad.name}</td>
                    <td className={`px-5 py-2 ${getStatusColor(ad.status)}`}>{ad.status}</td>
                    <td className="px-5 py-2 font-mono">{ad.adset_id}</td>
                    <td className="px-5 py-2 font-mono">{JSON.stringify(ad.creative)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {/* Insights per Negara */}
        {insightsCountry.length > 0 && (
          <Section title="Insights Breakdown Negara (April 2024)">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-green-700 text-white uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Negara</th>
                  <th className="px-5 py-3">Impressions</th>
                  <th className="px-5 py-3">Clicks</th>
                  <th className="px-5 py-3">Spend (IDR)</th>
                  <th className="px-5 py-3">CTR (%)</th>
                  <th className="px-5 py-3">CPM (IDR)</th>
                </tr>
              </thead>
              <tbody>
                {insightsCountry.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-green-50"}>
                    <td className="px-5 py-2 font-mono">{item.country}</td>
                    <td className="px-5 py-2">{item.impressions}</td>
                    <td className="px-5 py-2">{item.clicks}</td>
                    <td className="px-5 py-2">{item.spend}</td>
                    <td className="px-5 py-2">{item.ctr}</td>
                    <td className="px-5 py-2">{item.cpm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}
      </div>
    </div>
  );
}

export default App;
