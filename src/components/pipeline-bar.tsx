"use client";

import { useDeals } from "@/lib/deal-store";
import { STAGES, STAGE_COLORS, DealStage } from "@/lib/types";

const BAR_BG: Record<DealStage, string> = {
  未アプローチ: "bg-slate-400",
  アポイントメント: "bg-sky-400",
  ヒアリング: "bg-blue-400",
  提案: "bg-violet-400",
  見積: "bg-amber-400",
  商談中: "bg-orange-400",
  受注: "bg-emerald-400",
  納品: "bg-teal-400",
  失注: "bg-red-400",
};

export default function PipelineBar({ category }: { category: string }) {
  const { deals } = useDeals();
  const catDeals = deals.filter((d) => d.category === category);

  const stageData = STAGES.map((stage) => {
    const count = catDeals.filter((d) => d.stage === stage).length;
    return { stage, count };
  });

  const maxCount = Math.max(...stageData.map((s) => s.count), 1);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">ステージ別件数</h3>
      <div className="mt-4 space-y-2.5">
        {stageData.map(({ stage, count }) => (
          <div key={stage} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-right">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STAGE_COLORS[stage]}`}
              >
                {stage}
              </span>
            </span>
            <div className="flex-1">
              <div className="h-5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${BAR_BG[stage]} transition-all`}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-medium tabular-nums text-gray-600">
              {count}件
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
