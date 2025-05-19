// hooks/useAdAccountData.js
import { useState } from "react";
import axios from "axios";

export const useAdAccountData = (accessToken) => {
  const [campaigns, setCampaigns] = useState([]);
  const [adsets, setAdsets] = useState([]);
  const [ads, setAds] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllData = async (accountId) => {
    setLoading(true);
    setError("");
    try {
      const baseURL = `https://graph.facebook.com/v19.0/act_${accountId}`;

      const [c, a, d] = await Promise.all([
        axios.get(`${baseURL}/campaigns`, {
          params: {
            access_token: accessToken,
            fields: "id,name,status,objective,bid_strategy,daily_budget,lifetime_budget,buying_type,start_time,stop_time,effective_status",
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

      setCampaigns(c.data.data);
      setAdsets(a.data.data);
      setAds(d.data.data);
    } catch (err) {
      setError("Gagal mengambil data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async (accountId) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://graph.facebook.com/v19.0/act_${accountId}/insights`,
        {
          params: {
            access_token: accessToken,
            fields: "impressions,clicks,spend,ctr,cpm",
            breakdowns: "country",
            time_range: JSON.stringify({
              since: "2024-04-01",
              until: "2024-04-30",
            }),
          },
        }
      );
      setInsights(res.data.data);
    } catch (err) {
      setError("Gagal mengambil insight: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    campaigns,
    adsets,
    ads,
    insights,
    loading,
    error,
    fetchAllData,
    fetchInsights,
  };
};
