import React from "react";
import { formatBudget, getStatusColor, Section } from "../utils/helpers";

const AdSetsTable = ({ adsets }) => (
  <Section title="Ad Sets">
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="bg-indigo-600 text-white uppercase text-xs">
        <tr>
          <th className="px-5 py-3">ID</th>
          <th className="px-5 py-3">Nama</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3">Campaign ID</th>
          <th className="px-5 py-3">Anggaran</th>
          <th className="px-5 py-3">Billing</th>
          <th className="px-5 py-3">Optimisasi</th>
          <th className="px-5 py-3">Mulai</th>
          <th className="px-5 py-3">Selesai</th>
        </tr>
      </thead>
      <tbody>
        {adsets.map((a, idx) => (
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

export default AdSetsTable;
