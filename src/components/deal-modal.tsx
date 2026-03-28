"use client";

import { useState } from "react";
import { Deal, DealStage, STAGES, ASSIGNEES } from "@/lib/types";
import { createNewDeal, updateDealFields, useDeals } from "@/lib/deal-store";

interface Props {
  deal?: Deal;
  onClose: () => void;
  onSave: (deal: Deal) => void;
}

export default function DealModal({ deal, onClose, onSave }: Props) {
  const { deals } = useDeals();
  const isEdit = !!deal;
  const [form, setForm] = useState({
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
      onSave(createNewDeal(deals, form));
    }
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const showWonAmount = form.stage === "受注" || form.stage === "納品";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900">
          {isEdit ? "案件を編集" : "新規案件を登録"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
                onChange={(e) => set("stage", e.target.value as DealStage)}
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
                onChange={(e) => set("wonAmount", Number(e.target.value))}
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
