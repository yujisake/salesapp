import { DealStage, STAGE_COLORS } from "@/lib/types";

export default function StageBadge({ stage }: { stage: DealStage }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STAGE_COLORS[stage]}`}
    >
      {stage}
    </span>
  );
}
