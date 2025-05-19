// App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import CampaignsTable from "./components/CampaignsTable";
import AdSetsTable from "./components/AdSetsTable";
import AdsTable from "./components/AdsTable";
import InsightsTable from "./components/InsightsTable";
import AccountSelector from "./components/AccountSelector";
import countries from "i18n-iso-countries";
import "i18n-iso-countries/langs/id.json";

countries.registerLocale(require("i18n-iso-countries/langs/id.json"));

function App() {
  const [startDate, setStartDate] = useState("2023-04-01");
  const [endDate, setEndDate] = useState("2025-05-30");
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
          setSelectedAccount(res.data.data[0].id);
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
          time_range: JSON.stringify({ since: startDate, until: endDate }),
        },
      });

      const mapped = response.data.data.map((item) => {
        const countryCode = item.country || item.breakdowns?.country || "UNKNOWN";
        const fullCountryName =
          countries.getName(countryCode, "id", { select: "official" }) || countryCode;

        return {
          ...item,
          country: fullCountryName,
        };
      });

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
    return isNaN(number)
      ? "-"
      : number.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        });
  };

  const formatPercentage = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? "-" : number.toFixed(2) + "%";
  };

  const filteredInsights =
    selectedCountries.length > 0
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

          <div className="flex items-center gap-4 my-4">
            <div>
              <label className="block text-sm font-medium text-blue-800">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800">Tanggal Selesai</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              />
            </div>
          </div>

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

        {insightsCountry.length > 0 && (
          <div className="bg-white p-6 mb-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-blue-700 mb-3">Filter Negara</h2>
            <div className="relative inline-block text-left w-64 mb-4">
              <label className="block text-sm font-medium text-blue-800 mb-1">Pilih Negara</label>
              <DropdownMultiSelect
                options={[...new Set(insightsCountry.map((i) => i.country))]}
                selectedOptions={selectedCountries}
                onChange={setSelectedCountries}
              />
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

        {campaigns.length > 0 && <CampaignsTable campaigns={campaigns} />}
        {adsets.length > 0 && <AdSetsTable adsets={adsets} />}
        {ads.length > 0 && <AdsTable ads={ads} />}
      </div>
    </div>
  );
}

function DropdownMultiSelect({ options, selectedOptions, onChange }) {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = () => setOpen(!open);
  const ref = React.useRef();

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((o) => o !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  const displayText =
    selectedOptions.length === 0
      ? "List countries"
      : selectedOptions.join(", ");

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full rounded border border-gray-300 bg-white py-2 px-3 text-left text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {displayText}
        <span className="float-right ml-2">&#9662;</span>
      </button>
      {open && (
        <div className="absolute mt-1 w-[36rem] max-h-[28rem] overflow-y-auto rounded border border-gray-300 bg-white shadow-lg z-10">
              <div className="grid grid-cols-4 gap-4 p-3 max-h-[28rem] overflow-y-auto">
                {options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 cursor-pointer whitespace-nowrap"
                    style={{ minWidth: "120px" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={() => toggleOption(option)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-sm text-gray-700 select-none">{option}</span>
                  </label>
                ))}
              </div>
        </div>
      )}
    </div>
  );
}

export default App;
