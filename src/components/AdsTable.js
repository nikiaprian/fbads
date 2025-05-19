import React, { useState } from "react";
import { getStatusColor, Section } from "../utils/helpers";

const AdsTable = ({ ads }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedAds = [...ads].sort((a, b) => {
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
    <Section title="Ads">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-teal-600 text-white uppercase text-xs">
          <tr>
            <th
              className="px-5 py-3 cursor-pointer select-none"
              onClick={() => handleSort("id")}
            >
              ID{getSortIndicator("id")}
            </th>
            <th
              className="px-5 py-3 cursor-pointer select-none"
              onClick={() => handleSort("name")}
            >
              Nama{getSortIndicator("name")}
            </th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 cursor-pointer select-none" onClick={() => handleSort("adset_id")}>
              Ad Set ID{getSortIndicator("adset_id")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedAds.map((ad, idx) => (
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
  );
};

export default AdsTable;
