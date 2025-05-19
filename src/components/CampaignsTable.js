import React from "react";
import { formatBudget, getStatusColor, Section } from "../utils/helpers";

const CampaignsTable = ({ campaigns }) => (
  <Section title="Campaigns">
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="bg-blue-600 text-white uppercase text-xs">
        <tr>
          <th className="px-5 py-3">ID</th>
          <th className="px-5 py-3">Nama</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3">Objective</th>
          <th className="px-5 py-3">Strategi</th>
          <th className="px-5 py-3">Anggaran</th>
          <th className="px-5 py-3">Pembelian</th>
          <th className="px-5 py-3">Mulai</th>
          <th className="px-5 py-3">Selesai</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((c, idx) => (
          <tr key={c.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
            <td className="px-5 py-2 font-mono">{c.id}</td>
            <td className="px-5 py-2">{c.name}</td>
            <td className={`px-5 py-2 ${getStatusColor(c.status)}`}>{c.status}</td>
            <td className="px-5 py-2">{c.objective}</td>
            <td className="px-5 py-2">{c.bid_strategy || "-"}</td>
            <td className="px-5 py-2">
              {c.daily_budget ? formatBudget(c.daily_budget) : c.lifetime_budget ? formatBudget(c.lifetime_budget) : "-"}
            </td>
            <td className="px-5 py-2">{c.buying_type || "-"}</td>
            <td className="px-5 py-2">{c.start_time || "-"}</td>
            <td className="px-5 py-2">{c.stop_time || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Section>
);

export default CampaignsTable;
