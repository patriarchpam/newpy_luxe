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

export async function adminCreateService(data: Record<string, unknown>) {
  const { error } = await adminSupabase.from("services").insert([data]);
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

export async function adminCreateBooking(data: {
  serviceId: string;
  date: string;
  time: string;
  duration: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  deposit_amount: number;
  total_amount: number;
}) {
  // Generate a short ref
  const bookingRef = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const { error } = await adminSupabase.from("bookings").insert([{
    service_id: data.serviceId,
    customer_name: data.customerName,
    customer_email: data.customerEmail,
    customer_phone: data.customerPhone,
    date: data.date,
    time: data.time,
    duration: data.duration,
    status: "confirmed", // Admins usually confirm immediately
    notes: data.notes || "",
    booking_ref: bookingRef,
    deposit_amount: data.deposit_amount,
    total_amount: data.total_amount,
  }]);

  if (error) return { error: error.message };
  return { success: true, bookingRef };
}

export async function adminUpdateBooking(id: string, updates: Record<string, unknown>) {
  const { error } = await adminSupabase.from("bookings").update(updates).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function adminDeleteBooking(id: string) {
  const { error } = await adminSupabase.from("bookings").delete().eq("id", id);
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
