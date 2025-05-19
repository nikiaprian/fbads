// components/InsightsTable.js
import React from "react";
import { Section } from "../utils/helpers";

const InsightsTable = ({ insights }) => {
  return (
    <Section title="Insights per Negara">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-600 text-white uppercase text-xs">
          <tr>
            <th className="px-5 py-3">Negara</th>
            <th className="px-5 py-3">Impression</th>
            <th className="px-5 py-3">Klik</th>
            <th className="px-5 py-3">CTR</th>
            <th className="px-5 py-3">CPM</th>
            <th className="px-5 py-3">Belanja</th>
          </tr>
        </thead>
        <tbody>
          {insights.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
              <td className="px-5 py-2">{row.country}</td>
              <td className="px-5 py-2">{row.impressions}</td>
              <td className="px-5 py-2">{row.clicks}</td>
              <td className="px-5 py-2">{row.ctr}</td>
              <td className="px-5 py-2">{row.cpm}</td>
              <td className="px-5 py-2">{row.spend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
};

export default InsightsTable;
