import React, { useEffect, useState } from "react";
import axios from "axios";
import CampaignsTable from "./components/CampaignsTable";
import AdSetsTable from "./components/AdSetsTable";
import AdsTable from "./components/AdsTable";
import InsightsTable from "./components/InsightsTable";
import AccountSelector from "./components/AccountSelector";

function App() {
  const [accessToken] = useState(process.env.REACT_APP_FB_ACCESS_TOKEN);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [adsets, setAdsets] = useState([]);
  const [ads, setAds] = useState([]);
  const [insightsCountry, setInsightsCountry] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil semua ad accounts saat awal
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get("https://graph.facebook.com/v19.0/me/adaccounts", {
          params: {
            access_token: accessToken,
            fields: "id,name",
          },
        });
        setAccounts(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedAccount(res.data.data[0].id); // pilih yang pertama secara default
        }
      } catch (err) {
        setError("Gagal mengambil daftar akun: " + err.message);
      }
    };

    fetchAccounts();
  }, [accessToken]);

  const fetchAllData = async () => {
    if (!selectedAccount) return;
    setLoading(true);
    setError("");

    const accountId = selectedAccount.replace(/^act_/, "");
    const baseURL = `https://graph.facebook.com/v19.0/act_${accountId}`;

    try {
      const [campaignRes, adsetRes, adRes] = await Promise.all([
        axios.get(`${baseURL}/campaigns`, {
          params: {
            access_token: accessToken,
            fields: "id,name,status,daily_budget,lifetime_budget,insights{reach,impressions,frequency,spend,actions,cost_per_action_type}",
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

  const fetchInsightsWithCountryBreakdown = async () => {
    if (!selectedAccount) return;
    setLoading(true);
    setError("");

    const accountId = selectedAccount.replace(/^act_/, "");
    const url = `https://graph.facebook.com/v19.0/act_${accountId}/insights`;

    try {
      const response = await axios.get(url, {
        params: {
          access_token: accessToken,
          fields: "impressions,clicks,spend,ctr,cpm",
          breakdowns: "country",
          time_range: JSON.stringify({ since: "2024-04-01", until: "2024-04-30" }),
        },
      });

      const mapped = response.data.data.map((item) => ({
        ...item,
        country: item.country || item.breakdowns?.country || "UNKNOWN",
      }));

      setInsightsCountry(mapped);
      console.log("Contoh insight:", mapped[0]);
    } catch (err) {
      setError("Gagal mengambil data insight: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? "-" : number.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
  };

  const formatPercentage = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? "-" : number.toFixed(2) + "%";
  };

  const filteredInsights = selectedCountries.length > 0
    ? insightsCountry.filter((i) => selectedCountries.includes(i.country))
    : insightsCountry;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-4">📊 Facebook Ads Dashboard</h1>

          <AccountSelector
            accounts={accounts}
            selectedAccount={selectedAccount}
            onChange={setSelectedAccount}
          />

          <button
            onClick={fetchAllData}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full mr-4"
          >
            {loading ? "Memuat..." : "Ambil Semua Data"}
          </button>

          <button
            onClick={fetchInsightsWithCountryBreakdown}
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
          >
            {loading ? "Memuat..." : "Ambil Insights Breakdown Negara"}
          </button>

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>

        {/* Filter Negara + Tabel Insights */}
        {insightsCountry.length > 0 && (
          <div className="bg-white p-6 mb-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-blue-700 mb-3">Filter Negara</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {[...new Set(insightsCountry.map((i) => i.country))].map((country) => (
                <label
                  key={country}
                  className="flex items-center space-x-2 text-sm bg-blue-50 px-3 py-1 rounded shadow"
                >
                  <input
                    type="checkbox"
                    checked={selectedCountries.includes(country)}
                    onChange={() =>
                      setSelectedCountries((prev) =>
                        prev.includes(country)
                          ? prev.filter((c) => c !== country)
                          : [...prev, country]
                      )
                    }
                  />
                  <span>{country}</span>
                </label>
              ))}
            </div>

            <InsightsTable
              insights={filteredInsights.map((item) => ({
                ...item,
                spend: formatCurrency(item.spend),
                ctr: formatPercentage(item.ctr),
                cpm: formatCurrency(item.cpm),
              }))}
            />
          </div>
        )}

        {/* Tabel lainnya */}
        {campaigns.length > 0 && <CampaignsTable campaigns={campaigns} />}
        {adsets.length > 0 && <AdSetsTable adsets={adsets} />}
        {ads.length > 0 && <AdsTable ads={ads} />}
      </div>
    </div>
  );
}

export default App;
