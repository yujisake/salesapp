export type DealStage =
  | "未アプローチ"
  | "アポイントメント"
  | "ヒアリング"
  | "提案"
  | "見積"
  | "商談中"
  | "受注"
  | "納品"
  | "失注";

export interface Deal {
  id: string;
  dealNumber: string;
  companyName: string;
  stage: DealStage;
  nextAction: string;
  assignee: string;
  scheduledDate: string;
  result: string;
  hypothesis: string;
  wonAmount: number;
  createdAt: string;
  updatedAt: string;
}

export const STAGES: DealStage[] = [
  "未アプローチ",
  "アポイントメント",
  "ヒアリング",
  "提案",
  "見積",
  "商談中",
  "受注",
  "納品",
  "失注",
];

export const STAGE_COLORS: Record<DealStage, string> = {
  未アプローチ: "bg-slate-100 text-slate-700",
  アポイントメント: "bg-sky-100 text-sky-700",
  ヒアリング: "bg-blue-100 text-blue-700",
  提案: "bg-violet-100 text-violet-700",
  見積: "bg-amber-100 text-amber-700",
  商談中: "bg-orange-100 text-orange-700",
  受注: "bg-emerald-100 text-emerald-700",
  納品: "bg-teal-100 text-teal-700",
  失注: "bg-red-100 text-red-700",
};

export const ASSIGNEES = [
  "村上",
  "松田",
  "土田",
  "吉田",
  "小澤",
  "星野",
  "その他",
] as const;

export type Assignee = (typeof ASSIGNEES)[number];
