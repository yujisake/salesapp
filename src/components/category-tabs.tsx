"use client";

import { useState } from "react";
import { useDeals } from "@/lib/deal-store";

interface Props {
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryTabs({ active, onChange }: Props) {
  const { categories, addCategory, removeCategory, deals } = useDeals();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  function handleAdd() {
    const name = newName.trim();
    if (name && !categories.includes(name)) {
      addCategory(name);
      onChange(name);
    }
    setNewName("");
    setIsAdding(false);
  }

  function handleRemove(cat: string, e: React.MouseEvent) {
    e.stopPropagation();
    const hasDeals = deals.some((d) => d.category === cat);
    if (hasDeals) {
      if (!confirm(`「${cat}」には案件があります。ダッシュボードを削除しますか？\n（案件データは削除されません）`)) {
        return;
      }
    }
    removeCategory(cat);
    if (active === cat) {
      onChange(categories[0] === cat ? categories[1] ?? "" : categories[0]);
    }
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 pb-px">
      {categories.map((cat) => {
        const count = deals.filter((d) => d.category === cat).length;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`group relative flex items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition ${
              active === cat
                ? "border-b-2 border-blue-600 bg-white text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            {cat}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                active === cat
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {count}
            </span>
            {categories.length > 1 && (
              <span
                onClick={(e) => handleRemove(cat, e)}
                className="ml-1 hidden rounded p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-500 group-hover:inline-flex"
                title="ダッシュボードを削除"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}
          </button>
        );
      })}

      {isAdding ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
          className="flex items-center gap-1 px-2"
        >
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleAdd}
            placeholder="名前を入力..."
            className="w-28 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 whitespace-nowrap px-3 py-2.5 text-sm text-gray-400 transition hover:text-blue-600"
          title="ダッシュボードを追加"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          追加
        </button>
      )}
    </div>
  );
}
