"use client";

import { useState, useMemo } from "react";
import { useDeals } from "@/lib/deal-store";
import { Deal, DealStage, STAGES, ASSIGNEES } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import StageBadge from "./stage-badge";
import DealModal from "./deal-modal";
import DeleteConfirm from "./delete-confirm";

type SortKey =
  | "dealNumber"
  | "companyName"
  | "stage"
  | "assignee"
  | "scheduledDate"
  | "updatedAt";
type SortDir = "asc" | "desc";

export default function DealTable({ category }: { category: string }) {
  const { deals, dispatch } = useDeals();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<DealStage | "すべて">(
    "すべて"
  );
  const [assigneeFilter, setAssigneeFilter] = useState<string>("すべて");
  const [sortKey, setSortKey] = useState<SortKey>("dealNumber");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);

  const filtered = useMemo(() => {
    let list = deals.filter((d) => d.category === category);
    if (stageFilter !== "すべて") {
      list = list.filter((d) => d.stage === stageFilter);
    }
    if (assigneeFilter !== "すべて") {
      list = list.filter((d) => d.assignee === assigneeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.companyName.toLowerCase().includes(q) ||
          d.contactName.toLowerCase().includes(q) ||
          d.nextAction.toLowerCase().includes(q) ||
          d.assignee.toLowerCase().includes(q) ||
          d.dealNumber.includes(q)
      );
    }
    const sorted = [...list].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDir === "asc"
        ? aStr.localeCompare(bStr, "ja")
        : bStr.localeCompare(aStr, "ja");
    });
    return sorted;
  }, [deals, category, search, stageFilter, assigneeFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-3">
          <input
            type="text"
            placeholder="検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:max-w-[200px]"
          />
          <select
            value={stageFilter}
            onChange={(e) =>
              setStageFilter(e.target.value as DealStage | "すべて")
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="すべて">すべてのステージ</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="すべて">すべての担当</option>
            {ASSIGNEES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          新規案件
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <Th onClick={() => toggleSort("dealNumber")}>
                No. {sortIcon("dealNumber")}
              </Th>
              <Th onClick={() => toggleSort("companyName")}>
                会社名 {sortIcon("companyName")}
              </Th>
              <Th>相手担当者</Th>
              <Th onClick={() => toggleSort("stage")}>
                ステージ {sortIcon("stage")}
              </Th>
              <Th>次回アクション</Th>
              <Th onClick={() => toggleSort("assignee")}>
                担当 {sortIcon("assignee")}
              </Th>
              <Th onClick={() => toggleSort("scheduledDate")}>
                実行予定日 {sortIcon("scheduledDate")}
              </Th>
              <Th>進捗・結果</Th>
              <Th>仮説</Th>
              <Th>受注金額</Th>
              <Th align="right">操作</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-12 text-center text-sm text-gray-400"
                >
                  該当する案件がありません
                </td>
              </tr>
            ) : (
              filtered.map((deal) => (
                <tr
                  key={deal.id}
                  className="cursor-pointer transition hover:bg-gray-50"
                  onClick={() => setEditingDeal(deal)}
                >
                  <td className="px-4 py-3 text-sm font-mono text-gray-500 tabular-nums">
                    {deal.dealNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {deal.companyName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {deal.contactName}
                  </td>
                  <td className="px-4 py-3">
                    <StageBadge stage={deal.stage} />
                  </td>
                  <td className="max-w-[180px] px-4 py-3 text-sm text-gray-600">
                    <span className="line-clamp-2">{deal.nextAction}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {deal.assignee}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 tabular-nums whitespace-nowrap">
                    {formatDate(deal.scheduledDate)}
                  </td>
                  <td className="max-w-[180px] px-4 py-3 text-sm text-gray-600">
                    <span className="line-clamp-2">{deal.result}</span>
                  </td>
                  <td className="max-w-[180px] px-4 py-3 text-sm text-gray-600">
                    <span className="line-clamp-2">{deal.hypothesis}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 tabular-nums whitespace-nowrap">
                    {deal.wonAmount > 0 ? formatCurrency(deal.wonAmount) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingDeal(deal);
                      }}
                      className="rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      title="削除"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-right text-xs text-gray-400">
        {filtered.length}件を表示
      </div>

      {/* Modals */}
      {isNewModalOpen && (
        <DealModal
          category={category}
          onClose={() => setIsNewModalOpen(false)}
          onSave={(deal) => {
            dispatch({ type: "ADD", deal });
            setIsNewModalOpen(false);
          }}
        />
      )}
      {editingDeal && (
        <DealModal
          deal={editingDeal}
          onClose={() => setEditingDeal(null)}
          onSave={(deal) => {
            dispatch({ type: "UPDATE", deal });
            setEditingDeal(null);
          }}
        />
      )}
      {deletingDeal && (
        <DeleteConfirm
          companyName={deletingDeal.companyName}
          onCancel={() => setDeletingDeal(null)}
          onConfirm={() => {
            dispatch({ type: "DELETE", id: deletingDeal.id });
            setDeletingDeal(null);
          }}
        />
      )}
    </div>
  );
}

function Th({
  children,
  onClick,
  align,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  align?: "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase select-none whitespace-nowrap ${
        onClick ? "cursor-pointer" : ""
      } ${align === "right" ? "text-right" : "text-left"}`}
      onClick={onClick}
    >
      {children}
    </th>
  );
}
