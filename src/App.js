import React, { useState } from "react";
import axios from "axios";

function App() {
  const [accessToken, setAccessToken] = useState(
    "EAAZAueR326e8BO6ZCfmx2c3Yd53aEIr6bRrP5Xrf5ADzrDY4YLpqmVESiEN42sACHt9nY1k2oJRLwKvobqzZBEM5r9Ih4xGeSs2ZBooqgpTR8cPCrsLiO32a3MFDkmPvNQPl18BBno48ZC7Yz0NFYxJmhoBpcfmNbuaGzZA3ZCRh6WLGs3C87oII43HatmdQtbU"
  );
  const [adAccountId, setAdAccountId] = useState("295662601129905");

  const [campaigns, setCampaigns] = useState([]);
  const [adsets, setAdsets] = useState([]);
  const [ads, setAds] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllData = async () => {
    setLoading(true);
    setError("");

    try {
      const baseURL = `https://graph.facebook.com/v19.0/act_${adAccountId}`;

      const [campaignRes, adsetRes, adRes] = await Promise.all([
        axios.get(`${baseURL}/campaigns`, {
          params: {
            access_token: accessToken,
            fields:
              "id,name,status,objective,bid_strategy,daily_budget,lifetime_budget,buying_type,start_time,stop_time,effective_status",
          },
        }),
        axios.get(`${baseURL}/adsets`, {
          params: {
            access_token: accessToken,
            fields: "id,name,status,campaign_id,daily_budget,start_time,end_time,billing_event,optimization_goal",
          },
        }),
        axios.get(`${baseURL}/ads`, {
          params: {
            access_token: accessToken,
            fields: "id,name,status,adset_id,creative",
          },
        }),
      ]);

      setCampaigns(campaignRes.data.data);
      setAdsets(adsetRes.data.data);
      setAds(adRes.data.data);
    } catch (err) {
      setError("Gagal mengambil data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (budget) =>
    budget ? `${parseInt(budget) / 100} IDR` : "-";

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 font-bold";
      case "PAUSED":
        return "text-yellow-600 font-bold";
      case "ARCHIVED":
        return "text-gray-500 italic";
      default:
        return "text-red-600 font-semibold";
    }
  };

  const Section = ({ title, children }) => (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">{title}</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
            📊 Facebook Ads Dashboard
          </h1>
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition duration-200 shadow"
          >
            {loading ? "Memuat..." : "Ambil Semua Data"}
          </button>
          {error && <p className="text-red-600 mt-3">{error}</p>}
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
                  <th className="px-5 py-3">Objective</th>
                  <th className="px-5 py-3">Strategi</th>
                  <th className="px-5 py-3">Anggaran</th>
                  <th className="px-5 py-3">Pembelian</th>
                  <th className="px-5 py-3">Mulai</th>
                  <th className="px-5 py-3">Selesai</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, idx) => (
                  <tr key={c.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                    <td className="px-5 py-2 font-mono">{c.id}</td>
                    <td className="px-5 py-2">{c.name}</td>
                    <td className={`px-5 py-2 ${getStatusColor(c.status)}`}>{c.status}</td>
                    <td className="px-5 py-2">{c.objective}</td>
                    <td className="px-5 py-2">{c.bid_strategy || "-"}</td>
                    <td className="px-5 py-2">
                      {c.daily_budget
                        ? formatBudget(c.daily_budget)
                        : c.lifetime_budget
                        ? formatBudget(c.lifetime_budget)
                        : "-"}
                    </td>
                    <td className="px-5 py-2">{c.buying_type || "-"}</td>
                    <td className="px-5 py-2">{c.start_time || "-"}</td>
                    <td className="px-5 py-2">{c.stop_time || "-"}</td>
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
                  <th className="px-5 py-3">Billing</th>
                  <th className="px-5 py-3">Optimisasi</th>
                  <th className="px-5 py-3">Mulai</th>
                  <th className="px-5 py-3">Selesai</th>
                </tr>
              </thead>
              <tbody>
                {adsets.map((a, idx) => (
                  <tr key={a.id} className={idx % 2 === 0 ? "bg-white" : "bg-indigo-50"}>
                    <td className="px-5 py-2 font-mono">{a.id}</td>
                    <td className="px-5 py-2">{a.name}</td>
                    <td className={`px-5 py-2 ${getStatusColor(a.status)}`}>{a.status}</td>
                    <td className="px-5 py-2">{a.campaign_id}</td>
                    <td className="px-5 py-2">{formatBudget(a.daily_budget)}</td>
                    <td className="px-5 py-2">{a.billing_event}</td>
                    <td className="px-5 py-2">{a.optimization_goal}</td>
                    <td className="px-5 py-2">{a.start_time || "-"}</td>
                    <td className="px-5 py-2">{a.end_time || "-"}</td>
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
              <thead className="bg-teal-600 text-white uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Ad Set ID</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad, idx) => (
                  <tr key={ad.id} className={idx % 2 === 0 ? "bg-white" : "bg-teal-50"}>
                    <td className="px-5 py-2 font-mono">{ad.id}</td>
                    <td className="px-5 py-2">{ad.name}</td>
                    <td className={`px-5 py-2 ${getStatusColor(ad.status)}`}>{ad.status}</td>
                    <td className="px-5 py-2">{ad.adset_id}</td>
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
