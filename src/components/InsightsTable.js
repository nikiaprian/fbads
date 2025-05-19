import React, { useState } from "react";

const InsightsTable = ({ insights }) => {
  const [sortBy, setSortBy] = useState("country");
  const [sortOrder, setSortOrder] = useState("asc");

  const sorted = [...insights].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (sortBy === "spend" || sortBy === "impressions" || sortBy === "clicks" || sortBy === "ctr" || sortBy === "cpm") {
      const aNum = parseFloat(aVal) || 0;
      const bNum = parseFloat(bVal) || 0;
      return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
    }

    return sortOrder === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const renderHeader = (label, key) => (
    <th
      className="px-5 py-3 cursor-pointer hover:underline"
      onClick={() => {
        if (sortBy === key) {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortBy(key);
          setSortOrder("asc");
        }
      }}
    >
      {label} {sortBy === key && (sortOrder === "asc" ? "▲" : "▼")}
    </th>
  );

  return (
    <div className="bg-white p-6 mt-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Perincian Insight Berdasarkan Negara</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-blue-600 text-white uppercase text-xs">
            <tr>
              {renderHeader("Negara", "country")}
              {renderHeader("Impression", "impressions")}
              {renderHeader("Klik", "clicks")}
              {renderHeader("CTR", "ctr")}
              {renderHeader("CPM", "cpm")}
              {renderHeader("Belanja (Rp)", "spend")}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                <td className="px-5 py-2">{row.country}</td>
                <td className="px-5 py-2">{parseInt(row.impressions).toLocaleString()}</td>
                <td className="px-5 py-2">{parseInt(row.clicks).toLocaleString()}</td>
                <td className="px-5 py-2">{parseFloat(row.ctr).toFixed(2)}%</td>
                <td className="px-5 py-2">{parseFloat(row.cpm).toFixed(2)}</td>
                <td className="px-5 py-2">
                  Rp {parseFloat(row.spend).toLocaleString("id-ID", { minimumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InsightsTable;
