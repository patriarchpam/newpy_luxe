"use server";

import { adminSupabase } from "@/lib/supabase";

// ─── SERVICES ───────────────────────────────────────────────────────────────

export async function getAdminServices() {
  const { data, error } = await adminSupabase.from("services").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data;
}

export async function updateService(id: string, updates: Record<string, unknown>) {
  const { error } = await adminSupabase.from("services").update(updates).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// ─── BOOKINGS ───────────────────────────────────────────────────────────────

export async function getAdminBookings() {
  const { data, error } = await adminSupabase
    .from("bookings")
    .select("*, service:services(name)")
    .order("date", { ascending: false })
    .order("time", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateBookingStatus(id: string, status: string) {
  const { error } = await adminSupabase.from("bookings").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// Rescheduling requires freeing the old slot and occupying a new one.
// Because we calculate availability dynamically, we just need to update the date and time!
export async function rescheduleBooking(id: string, newDate: string, newTime: string) {
  // Ideally, we'd also run a transactional check here, but for admin overrides, we can just update it.
  const { error } = await adminSupabase
    .from("bookings")
    .update({ date: newDate, time: newTime })
    .eq("id", id);
    
  if (error) return { error: error.message };
  return { success: true };
}

// ─── SETTINGS (Business Hours & Blocked Dates) ──────────────────────────────

export async function getBusinessHours() {
  const { data, error } = await adminSupabase.from("business_hours").select("*").order("day_of_week");
  if (error) throw new Error(error.message);
  return data;
}

export async function updateBusinessHour(id: string, updates: Record<string, unknown>) {
  const { error } = await adminSupabase.from("business_hours").update(updates).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getBlockedDates() {
  const { data, error } = await adminSupabase.from("blocked_dates").select("*").order("date");
  if (error) throw new Error(error.message);
  return data;
}

export async function addBlockedDate(data: { date: string; start_time?: string; end_time?: string; reason?: string }) {
  const { error } = await adminSupabase.from("blocked_dates").insert([data]);
  if (error) return { error: error.message };
  return { success: true };
}

export async function removeBlockedDate(id: string) {
  const { error } = await adminSupabase.from("blocked_dates").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
