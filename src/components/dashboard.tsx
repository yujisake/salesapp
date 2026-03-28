"use client";

import { useState } from "react";
import { DEFAULT_CATEGORIES } from "@/lib/types";
import CategoryTabs from "./category-tabs";
import SummaryCards from "./summary-cards";
import PipelineBar from "./pipeline-bar";
import DealTable from "./deal-table";

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState<string>(
    DEFAULT_CATEGORIES[0]
  );

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      {/* Summary */}
      <SummaryCards category={activeCategory} />

      {/* Pipeline */}
      <PipelineBar category={activeCategory} />

      {/* Deal List */}
      <DealTable category={activeCategory} />
    </div>
  );
}
