import React, { useState } from "react";
import axios from "axios";

function App() {
  const [accessToken, setAccessToken] = useState(
    "EAAZAueR326e8BOyVzWU16GXkbW1YPsE0pZAE6B0PPRQNRSIb3DSlZCuJ1gTX3Wy4wGMkVV14mOFkbZBw4KZCIE31wBtgz34o96ZAH9eZBDFH4GsPOPV8KxYSoxg7sPSXnrXCyBdslPmeLuwyfLPruiqRPj51DOF1DTAcsgwJw1GjKrRbOZCX1PGydkYll4pcHV4zahSMfjLaHwR4H4HEJAAvAORexfqJ"
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
    budget ? `${(parseInt(budget) / 100).toLocaleString("id-ID")} IDR` : "-";

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-700";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-500 italic";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 font-sans">
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-blue-900 flex items-center gap-3">
          <span>📊</span> Facebook Ads Dashboard
        </h1>
        <button
          onClick={fetchCampaigns}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition duration-200 flex items-center gap-2"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {loading ? "Memuat..." : "Refresh Data"}
        </button>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-100 text-red-700 rounded shadow">
          {error}
        </div>
      )}

      {campaigns.length === 0 && !loading && (
        <p className="max-w-7xl mx-auto text-center text-gray-500">
          Klik tombol "Refresh Data" untuk mengambil campaign.
        </p>
      )}

      <main className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 truncate" title={c.name}>
              {c.name}
            </h2>
            <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(c.status)}`}>
              {c.status}
            </p>

            <div className="mt-4 space-y-2 text-gray-700">
              <div>
                <strong>Objective: </strong>
                <span className="capitalize">{c.objective || "-"}</span>
              </div>
              <div>
                <strong>Bid Strategy: </strong>
                <span>{c.bid_strategy || "-"}</span>
              </div>
              <div>
                <strong>Budget: </strong>
                <span>
                  {c.daily_budget
                    ? formatBudget(c.daily_budget)
                    : c.lifetime_budget
                    ? formatBudget(c.lifetime_budget)
                    : "-"}
                </span>
              </div>
              <div>
                <strong>Buying Type: </strong>
                <span>{c.buying_type || "-"}</span>
              </div>
              <div>
                <strong>Start: </strong>
                <time dateTime={c.start_time}>{c.start_time || "-"}</time>
              </div>
              <div>
                <strong>Stop: </strong>
                <time dateTime={c.stop_time}>{c.stop_time || "-"}</time>
              </div>
            </div>
            <small className="block mt-4 font-mono text-xs text-gray-400 truncate" title={c.id}>
              ID: {c.id}
            </small>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
