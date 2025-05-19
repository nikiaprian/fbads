import React, { useState } from "react";
import axios from "axios";

function App() {
  const [accessToken, setAccessToken] = useState(
    "EAAZAueR326e8BOZC11zzkjOcLxyJJUyMULD5jvHZBZCh1Ky6xT6fzIU3pjmMvcRvyGVAndILTmuMtUNFBaWmodA0tT98PMrIKMBdXZBzaF7clBqmYs1HwHFKO7yWRn41PSZCs2CiaRetkN88NFe511BWuTJweWQqfMpoWqqjHq8Re65RZBtEGCFpTrJJ7Q1ZAZBeHiHbCrEv3k1hnBPXdZAibMh9g9F3AZD"
  );
  const [adAccountId, setAdAccountId] = useState("295662601129905");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCampaigns = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v19.0/act_${adAccountId}/campaigns`,
        {
          params: {
            access_token: accessToken,
            fields:
              "id,name,status,objective,bid_strategy,daily_budget,lifetime_budget,buying_type,start_time,stop_time,effective_status",
          },
        }
      );
      setCampaigns(response.data.data);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
            📊 Facebook Ads Dashboard
          </h1>
          <button
            onClick={fetchCampaigns}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition duration-200 shadow"
          >
            {loading ? "Memuat..." : "Get Data"}
          </button>
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>

        {campaigns.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-blue-600 text-white uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Objective</th>
                  <th className="px-5 py-3">Strategi Penawaran</th>
                  <th className="px-5 py-3">Anggaran</th>
                  <th className="px-5 py-3">Tipe Pembelian</th>
                  <th className="px-5 py-3">Mulai</th>
                  <th className="px-5 py-3">Selesai</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, idx) => (
                  <tr
                    key={c.id}
                    className={
                      idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                    }
                  >
                    <td className="px-5 py-2 font-mono">{c.id}</td>
                    <td className="px-5 py-2 font-medium">{c.name}</td>
                    <td className={`px-5 py-2 ${getStatusColor(c.status)}`}>{
                      c.status
                    }</td>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
