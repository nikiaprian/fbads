import React from "react";
import { Section } from "../utils/helpers";

const InsightsTable = ({ insights }) => (
  <Section title="Insights per Negara">
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="bg-green-600 text-white uppercase text-xs">
        <tr>
          <th className="px-5 py-3">Negara</th>
          <th className="px-5 py-3">Impressions</th>
          <th className="px-5 py-3">Clicks</th>
          <th className="px-5 py-3">CTR</th>
          <th className="px-5 py-3">CPM</th>
          <th className="px-5 py-3">Spend</th>
        </tr>
      </thead>
      <tbody>
        {insights.map((i, idx) => (
          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-green-50"}>
            <td className="px-5 py-2">{i.country}</td>
            <td className="px-5 py-2">{i.impressions}</td>
            <td className="px-5 py-2">{i.clicks}</td>
            <td className="px-5 py-2">{i.ctr}</td>
            <td className="px-5 py-2">{i.cpm}</td>
            <td className="px-5 py-2">{i.spend}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Section>
);

export default InsightsTable;
