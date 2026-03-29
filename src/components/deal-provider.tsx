"use client";

import {
  useReducer,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { DealContext, dealReducer, type DealAction } from "@/lib/deal-store";
import { DEFAULT_CATEGORIES } from "@/lib/types";
import {
  fetchDeals,
  insertDeal,
  updateDeal,
  deleteDeal,
} from "@/lib/supabase-deals";

export default function DealProvider({ children }: { children: ReactNode }) {
  const [deals, rawDispatch] = useReducer(dealReducer, []);
  const [categories, setCategories] = useState<string[]>([
    ...DEFAULT_CATEGORIES,
  ]);
  const [loading, setLoading] = useState(true);

  // 初回ロード: Supabaseから全件取得
  useEffect(() => {
    fetchDeals()
      .then((data) => {
        for (const deal of data) {
          rawDispatch({ type: "ADD", deal });
        }
      })
      .catch((err) => console.error("Failed to fetch deals:", err))
      .finally(() => setLoading(false));
  }, []);

  // Supabase同期付きdispatch
  const dispatch = useCallback(
    async (action: DealAction) => {
      rawDispatch(action);
      try {
        switch (action.type) {
          case "ADD":
            await insertDeal(action.deal);
            break;
          case "UPDATE":
            await updateDeal(action.deal);
            break;
          case "DELETE":
            await deleteDeal(action.id);
            break;
        }
      } catch (err) {
        console.error("Supabase sync error:", err);
      }
    },
    []
  );

  const addCategory = useCallback((name: string) => {
    setCategories((prev) =>
      prev.includes(name) ? prev : [...prev, name]
    );
  }, []);

  const removeCategory = useCallback((name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <DealContext value={{ deals, dispatch, categories, addCategory, removeCategory }}>
      {children}
    </DealContext>
  );
}
