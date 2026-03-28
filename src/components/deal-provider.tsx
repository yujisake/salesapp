"use client";

import { useReducer, useState, useCallback, type ReactNode } from "react";
import { DealContext, dealReducer } from "@/lib/deal-store";
import { initialDeals } from "@/lib/mock-data";
import { DEFAULT_CATEGORIES } from "@/lib/types";

export default function DealProvider({ children }: { children: ReactNode }) {
  const [deals, dispatch] = useReducer(dealReducer, initialDeals);
  const [categories, setCategories] = useState<string[]>([
    ...DEFAULT_CATEGORIES,
  ]);

  const addCategory = useCallback((name: string) => {
    setCategories((prev) =>
      prev.includes(name) ? prev : [...prev, name]
    );
  }, []);

  const removeCategory = useCallback((name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  }, []);

  return (
    <DealContext value={{ deals, dispatch, categories, addCategory, removeCategory }}>
      {children}
    </DealContext>
  );
}
