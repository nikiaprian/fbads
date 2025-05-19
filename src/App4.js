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

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>📊 Facebook Ads Dashboard</h2>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={fetchCampaigns} disabled={loading}>
          {loading ? "Memuat..." : "Ambil Data Campaigns"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {campaigns.length > 0 && (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Status</th>
              <th>Objective</th>
              <th>Strategi Penawaran</th>
              <th>Anggaran</th>
              <th>Tipe Pembelian</th>
              <th>Mulai</th>
              <th>Selesai</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.status}</td>
                <td>{c.objective}</td>
                <td>{c.bid_strategy || "-"}</td>
                <td>
                  {c.daily_budget
                    ? formatBudget(c.daily_budget)
                    : c.lifetime_budget
                    ? formatBudget(c.lifetime_budget)
                    : "-"}
                </td>
                <td>{c.buying_type || "-"}</td>
                <td>{c.start_time || "-"}</td>
                <td>{c.stop_time || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
