"use client";

import { useState } from "react";
import { Deal, DealStage, STAGES, ASSIGNEES } from "@/lib/types";
import { createNewDeal, updateDealFields, useDeals } from "@/lib/deal-store";
import { formatDate } from "@/lib/utils";
import StageBadge from "./stage-badge";

interface Props {
  deal?: Deal;
  category?: string;
  onClose: () => void;
  onSave: (deal: Deal) => void;
}

export default function DealModal({ deal, category, onClose, onSave }: Props) {
  const { deals } = useDeals();
  const isEdit = !!deal;
  const [tab, setTab] = useState<"edit" | "history">("edit");
  const [form, setForm] = useState({
    category: deal?.category ?? category ?? "",
    companyName: deal?.companyName ?? "",
    contactName: deal?.contactName ?? "",
    stage: deal?.stage ?? ("未アプローチ" as DealStage),
    nextAction: deal?.nextAction ?? "",
    assignee: deal?.assignee ?? "村上",
    scheduledDate:
      deal?.scheduledDate ?? new Date().toISOString().split("T")[0],
    result: deal?.result ?? "",
    hypothesis: deal?.hypothesis ?? "",
    wonAmount: deal?.wonAmount ?? 0,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEdit) {
      onSave(updateDealFields(deal, form));
    } else {
      onSave(createNewDeal(deals, { ...form, activities: [] }));
    }
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const showWonAmount = form.stage === "受注" || form.stage === "納品";
  const activities = deal?.activities ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with tabs */}
        <div className="border-b border-gray-200 px-6 pt-6">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "案件を編集" : "新規案件を登録"}
          </h2>
          {isEdit && (
            <div className="mt-3 flex gap-4">
              <button
                onClick={() => setTab("edit")}
                className={`border-b-2 pb-2 text-sm font-medium transition ${
                  tab === "edit"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                編集
              </button>
              <button
                onClick={() => setTab("history")}
                className={`border-b-2 pb-2 text-sm font-medium transition ${
                  tab === "history"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                履歴（{activities.length}件）
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {tab === "edit" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="会社名" required>
                  <input
                    type="text"
                    required
                    value={form.companyName}
                    onChange={(e) => set("companyName", e.target.value)}
                  />
                </Field>
                <Field label="相手担当者">
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="ステージ">
                  <select
                    value={form.stage}
                    onChange={(e) =>
                      set("stage", e.target.value as DealStage)
                    }
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="担当">
                  <select
                    value={form.assignee}
                    onChange={(e) => set("assignee", e.target.value)}
                  >
                    {ASSIGNEES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="次回アクション">
                <textarea
                  rows={2}
                  value={form.nextAction}
                  onChange={(e) => set("nextAction", e.target.value)}
                />
              </Field>

              <Field label="実行予定日">
                <input
                  type="date"
                  value={form.scheduledDate}
                  onChange={(e) => set("scheduledDate", e.target.value)}
                />
              </Field>

              <Field label="進捗・結果">
                <textarea
                  rows={2}
                  value={form.result}
                  onChange={(e) => set("result", e.target.value)}
                />
              </Field>

              <Field label="仮説">
                <textarea
                  rows={2}
                  value={form.hypothesis}
                  onChange={(e) => set("hypothesis", e.target.value)}
                />
              </Field>

              {showWonAmount && (
                <Field label="受注金額（円）">
                  <input
                    type="number"
                    min={0}
                    value={form.wonAmount}
                    onChange={(e) =>
                      set("wonAmount", Number(e.target.value))
                    }
                  />
                </Field>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                  {isEdit ? "更新する" : "登録する"}
                </button>
              </div>
            </form>
          ) : (
            /* History tab */
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  まだ履歴がありません
                </p>
              ) : (
                <div className="relative space-y-0">
                  {/* Timeline line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />

                  {[...activities].reverse().map((log) => (
                    <div key={log.id} className="relative flex gap-4 pb-5">
                      {/* Timeline dot */}
                      <div className="relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-blue-400 bg-white" />

                      <div className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">
                            {formatDate(log.date)}
                          </span>
                          <StageBadge stage={log.stage} />
                        </div>

                        {log.nextAction && (
                          <div className="mt-2">
                            <span className="text-xs font-semibold text-gray-400">
                              次回アクション
                            </span>
                            <p className="text-sm text-gray-700">
                              {log.nextAction}
                            </p>
                          </div>
                        )}
                        {log.result && (
                          <div className="mt-2">
                            <span className="text-xs font-semibold text-gray-400">
                              進捗・結果
                            </span>
                            <p className="text-sm text-gray-700">
                              {log.result}
                            </p>
                          </div>
                        )}
                        {log.hypothesis && (
                          <div className="mt-2">
                            <span className="text-xs font-semibold text-gray-400">
                              仮説
                            </span>
                            <p className="text-sm text-gray-700">
                              {log.hypothesis}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  閉じる
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <div className="mt-1 [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-gray-300 [&>input]:px-3 [&>input]:py-2 [&>input]:text-sm [&>input]:text-gray-900 [&>input]:shadow-sm [&>input]:focus:border-blue-500 [&>input]:focus:ring-1 [&>input]:focus:ring-blue-500 [&>input]:focus:outline-none [&>select]:w-full [&>select]:rounded-lg [&>select]:border [&>select]:border-gray-300 [&>select]:px-3 [&>select]:py-2 [&>select]:text-sm [&>select]:text-gray-900 [&>select]:shadow-sm [&>select]:focus:border-blue-500 [&>select]:focus:ring-1 [&>select]:focus:ring-blue-500 [&>select]:focus:outline-none [&>textarea]:w-full [&>textarea]:rounded-lg [&>textarea]:border [&>textarea]:border-gray-300 [&>textarea]:px-3 [&>textarea]:py-2 [&>textarea]:text-sm [&>textarea]:text-gray-900 [&>textarea]:shadow-sm [&>textarea]:focus:border-blue-500 [&>textarea]:focus:ring-1 [&>textarea]:focus:ring-blue-500 [&>textarea]:focus:outline-none">
        {children}
      </div>
    </label>
  );
}
