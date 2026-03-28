"use client";

import { createContext, useContext } from "react";
import { Deal } from "./types";

export type DealAction =
  | { type: "ADD"; deal: Deal }
  | { type: "UPDATE"; deal: Deal }
  | { type: "DELETE"; id: string };

export function dealReducer(state: Deal[], action: DealAction): Deal[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.deal];
    case "UPDATE":
      return state.map((d) => (d.id === action.deal.id ? action.deal : d));
    case "DELETE":
      return state.filter((d) => d.id !== action.id);
    default:
      return state;
  }
}

export function getNextDealNumber(deals: Deal[]): string {
  if (deals.length === 0) return "01";
  const maxNum = Math.max(
    ...deals.map((d) => parseInt(d.dealNumber, 10))
  );
  return String(maxNum + 1).padStart(2, "0");
}

export function createNewDeal(
  deals: Deal[],
  partial: Omit<Deal, "id" | "dealNumber" | "createdAt" | "updatedAt">
): Deal {
  const today = new Date().toISOString().split("T")[0];
  return {
    ...partial,
    id: crypto.randomUUID(),
    dealNumber: getNextDealNumber(deals),
    createdAt: today,
    updatedAt: today,
  };
}

export function updateDealFields(deal: Deal, updates: Partial<Deal>): Deal {
  const today = new Date().toISOString().split("T")[0];
  return {
    ...deal,
    ...updates,
    updatedAt: today,
  };
}

export const DealContext = createContext<{
  deals: Deal[];
  dispatch: React.Dispatch<DealAction>;
} | null>(null);

export function useDeals() {
  const ctx = useContext(DealContext);
  if (!ctx) throw new Error("useDeals must be used within DealProvider");
  return ctx;
}
