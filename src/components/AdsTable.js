import React from "react";
import { getStatusColor, Section } from "../utils/helpers";

const AdsTable = ({ ads }) => (
  <Section title="Ads">
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="bg-teal-600 text-white uppercase text-xs">
        <tr>
          <th className="px-5 py-3">ID</th>
          <th className="px-5 py-3">Nama</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3">Ad Set ID</th>
        </tr>
      </thead>
      <tbody>
        {ads.map((ad, idx) => (
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

export default AdsTable;
