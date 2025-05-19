// components/CampaignsTable.js
import React, { useMemo, useState } from "react";
import { Section } from "../utils/helpers";

// ── utility rupiah
const toRupiah = (v) =>
  v ? "Rp " + parseFloat(v).toLocaleString("id-ID", { minimumFractionDigits: 0 }) : "-";

// ── mapping kolom agar mudah dibuat header & sorting
const columns = [
  { key: "name", label: "Nama" },
  { key: "status", label: "Penayangan" },
  { key: "result", label: "Hasil", isNum: true },
  { key: "reach", label: "Jangkauan", isNum: true },
  { key: "impressions", label: "Tayangan", isNum: true },
  { key: "frequency", label: "Frekuensi", isNum: true },
  { key: "cpa", label: "Biaya per Hasil", isNum: true },
  { key: "budget", label: "Anggaran", isNum: true },
  { key: "spend", label: "Dibelanjakan", isNum: true },
];

const CampaignsTable = ({ campaigns }) => {
  const [sortBy, setSortBy] = useState("name");
  const [dir, setDir] = useState("asc"); // asc | desc

  // ── toggle sort
  const handleSort = (col) => {
    if (col === sortBy) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setDir("asc");
    }
  };

  // ── data kampanye diperkaya & di-sort
  const rows = useMemo(() => {
    const enriched = campaigns.map((c) => {
      const ins = c.insights?.data?.[0] || {};
      const actions = ins.actions?.[0];
      const budgetRaw = c.daily_budget || c.lifetime_budget || 0;
      return {
        id: c.id,
        name: c.name,
        status: c.status,
        result: actions?.value || 0,
        reach: +ins.reach || 0,
        impressions: +ins.impressions || 0,
        frequency: parseFloat(ins.frequency || 0),
        cpa: actions?.value ? ins.cost_per_action_type?.[0]?.value || 0 : 0,
        budget: budgetRaw / 100,
        spend: +ins.spend || 0,
      };
    });

    return enriched.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      // numerik vs string
      const compare =
        typeof valA === "number" && typeof valB === "number"
          ? valA - valB
          : String(valA).localeCompare(String(valB), "id-ID", { sensitivity: "base" });

      return dir === "asc" ? compare : -compare;
    });
  }, [campaigns, sortBy, dir]);

  return (
    <Section title="Campaigns">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-600 text-white uppercase text-xs cursor-pointer select-none">
          <tr>
            <th className="px-5 py-3">ID</th>
            {columns.map(({ key, label }) => (
              <th
                key={key}
                className="px-5 py-3"
                onClick={() => handleSort(key)}
              >
                {label}
                {sortBy === key && (
                  <span className="ml-1">{dir === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
              <td className="px-5 py-2 font-mono">{r.id}</td>
              <td className="px-5 py-2">{r.name}</td>
              <td className="px-5 py-2">{r.status}</td>
              <td className="px-5 py-2">{r.result || "-"}</td>
              <td className="px-5 py-2">{r.reach || "-"}</td>
              <td className="px-5 py-2">{r.impressions || "-"}</td>
              <td className="px-5 py-2">{r.frequency ? r.frequency.toFixed(2) : "-"}</td>
              <td className="px-5 py-2">{toRupiah(r.cpa)}</td>
              <td className="px-5 py-2">{toRupiah(r.budget)}</td>
              <td className="px-5 py-2">{toRupiah(r.spend)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
};

export default CampaignsTable;
