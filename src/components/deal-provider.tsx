"use client";

import { useReducer, type ReactNode } from "react";
import { DealContext, dealReducer } from "@/lib/deal-store";
import { initialDeals } from "@/lib/mock-data";

export default function DealProvider({ children }: { children: ReactNode }) {
  const [deals, dispatch] = useReducer(dealReducer, initialDeals);

  return (
    <DealContext value={{ deals, dispatch }}>
      {children}
    </DealContext>
  );
}
