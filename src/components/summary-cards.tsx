"use client";

import { useDeals } from "@/lib/deal-store";
import { formatCurrency } from "@/lib/utils";

export default function SummaryCards({ category }: { category: string }) {
  const { deals } = useDeals();
  const catDeals = deals.filter((d) => d.category === category);

  const active = catDeals.filter(
    (d) => d.stage !== "受注" && d.stage !== "納品" && d.stage !== "失注"
  );
  const won = catDeals.filter((d) => d.stage === "受注" || d.stage === "納品");
  const wonAmount = won.reduce((sum, d) => sum + d.wonAmount, 0);
  const lost = catDeals.filter((d) => d.stage === "失注");

  const cards = [
    { label: "全案件数", value: `${catDeals.length}件` },
    { label: "進行中", value: `${active.length}件` },
    { label: "受注・納品", value: `${won.length}件` },
    { label: "受注総額", value: formatCurrency(wonAmount) },
    { label: "失注", value: `${lost.length}件` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            {c.label}
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
