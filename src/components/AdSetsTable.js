import React, { useState } from "react";
import { formatBudget, getStatusColor, Section } from "../utils/helpers";

const AdSetsTable = ({ adsets }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedAdsets = [...adsets].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key] || "";
    const bValue = b[sortConfig.key] || "";

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const getSortIndicator = (key) => {
  if (sortConfig.key === key) {
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  }
  return <span className="text-gray-400 ml-1">▲▼</span>;
};


  return (
    <Section title="Ad Sets">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-indigo-600 text-white uppercase text-xs">
          <tr>
            <th className="px-5 py-3 cursor-pointer" onClick={() => handleSort("id")}>ID{getSortIndicator("id")}</th>
            <th className="px-5 py-3 cursor-pointer" onClick={() => handleSort("name")}>Nama{getSortIndicator("name")}</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 cursor-pointer" onClick={() => handleSort("campaign_id")}>Campaign ID{getSortIndicator("campaign_id")}</th>
            <th className="px-5 py-3 cursor-pointer" onClick={() => handleSort("daily_budget")}>Anggaran{getSortIndicator("daily_budget")}</th>
            <th className="px-5 py-3">Billing</th>
            <th className="px-5 py-3">Optimisasi</th>
            <th className="px-5 py-3 cursor-pointer" onClick={() => handleSort("start_time")}>Mulai{getSortIndicator("start_time")}</th>
            <th className="px-5 py-3 cursor-pointer" onClick={() => handleSort("end_time")}>Selesai{getSortIndicator("end_time")}</th>
          </tr>
        </thead>
        <tbody>
          {sortedAdsets.map((a, idx) => (
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
  );
};

export default AdSetsTable;
