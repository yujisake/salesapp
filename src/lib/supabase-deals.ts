import { supabase } from "./supabase";
import { Deal, ActivityLog } from "./types";

// --- DB行 → アプリ型への変換 ---

interface DbDeal {
  id: string;
  deal_number: string;
  category: string;
  company_name: string;
  contact_name: string;
  stage: string;
  next_action: string;
  assignee: string;
  scheduled_date: string | null;
  result: string;
  hypothesis: string;
  won_amount: number;
  created_at: string;
  updated_at: string;
}

interface DbActivity {
  id: string;
  deal_id: string;
  date: string;
  next_action: string;
  result: string;
  hypothesis: string;
  stage: string;
}

function toActivity(row: DbActivity): ActivityLog {
  return {
    id: row.id,
    date: row.date,
    nextAction: row.next_action,
    result: row.result,
    hypothesis: row.hypothesis,
    stage: row.stage as ActivityLog["stage"],
  };
}

function toDeal(row: DbDeal, activities: DbActivity[]): Deal {
  return {
    id: row.id,
    dealNumber: row.deal_number,
    category: row.category,
    companyName: row.company_name,
    contactName: row.contact_name,
    stage: row.stage as Deal["stage"],
    nextAction: row.next_action,
    assignee: row.assignee,
    scheduledDate: row.scheduled_date ?? "",
    result: row.result,
    hypothesis: row.hypothesis,
    wonAmount: row.won_amount,
    activities: activities
      .filter((a) => a.deal_id === row.id)
      .map(toActivity),
    createdAt: row.created_at.split("T")[0],
    updatedAt: row.updated_at.split("T")[0],
  };
}

// --- CRUD ---

export async function fetchDeals(): Promise<Deal[]> {
  const { data: deals, error: dealsError } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: true });

  if (dealsError) throw dealsError;

  const { data: activities, error: actError } = await supabase
    .from("activities")
    .select("*")
    .order("date", { ascending: true });

  if (actError) throw actError;

  return (deals as DbDeal[]).map((d) =>
    toDeal(d, (activities as DbActivity[]) ?? [])
  );
}

export async function insertDeal(deal: Deal): Promise<void> {
  const { error } = await supabase.from("deals").insert({
    id: deal.id,
    deal_number: deal.dealNumber,
    category: deal.category,
    company_name: deal.companyName,
    contact_name: deal.contactName,
    stage: deal.stage,
    next_action: deal.nextAction,
    assignee: deal.assignee,
    scheduled_date: deal.scheduledDate || null,
    result: deal.result,
    hypothesis: deal.hypothesis,
    won_amount: deal.wonAmount,
  });
  if (error) throw error;

  if (deal.activities.length > 0) {
    const { error: actError } = await supabase.from("activities").insert(
      deal.activities.map((a) => ({
        id: a.id,
        deal_id: deal.id,
        date: a.date,
        next_action: a.nextAction,
        result: a.result,
        hypothesis: a.hypothesis,
        stage: a.stage,
      }))
    );
    if (actError) throw actError;
  }
}

export async function updateDeal(deal: Deal): Promise<void> {
  const { error } = await supabase
    .from("deals")
    .update({
      deal_number: deal.dealNumber,
      category: deal.category,
      company_name: deal.companyName,
      contact_name: deal.contactName,
      stage: deal.stage,
      next_action: deal.nextAction,
      assignee: deal.assignee,
      scheduled_date: deal.scheduledDate || null,
      result: deal.result,
      hypothesis: deal.hypothesis,
      won_amount: deal.wonAmount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", deal.id);
  if (error) throw error;

  // activitiesは差分追加（既存を消さず、新しいものだけinsert）
  const { data: existing } = await supabase
    .from("activities")
    .select("id")
    .eq("deal_id", deal.id);

  const existingIds = new Set((existing ?? []).map((a: { id: string }) => a.id));
  const newActivities = deal.activities.filter((a) => !existingIds.has(a.id));

  if (newActivities.length > 0) {
    const { error: actError } = await supabase.from("activities").insert(
      newActivities.map((a) => ({
        id: a.id,
        deal_id: deal.id,
        date: a.date,
        next_action: a.nextAction,
        result: a.result,
        hypothesis: a.hypothesis,
        stage: a.stage,
      }))
    );
    if (actError) throw actError;
  }
}

export async function deleteDeal(id: string): Promise<void> {
  const { error } = await supabase.from("deals").delete().eq("id", id);
  if (error) throw error;
}
