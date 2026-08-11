"use server";

import { supabase } from "@/lib/supabase";
import { addMinutes, isBefore, parse, format } from "date-fns";

export async function getAvailableSlots(dateString: string, serviceId: string) {
  // 1. Fetch business hours for the day of the week
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();

  const { data: hours, error: hoursError } = await supabase
    .from("business_hours")
    .select("*")
    .eq("day_of_week", dayOfWeek)
    .single();

  if (hoursError || !hours || hours.is_closed) {
    return []; // Closed on this day
  }

  // 2. Fetch service details (duration and buffer)
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("duration, buffer_time")
    .eq("id", serviceId)
    .single();

  if (serviceError || !service) {
    throw new Error("Service not found");
  }

  // 3. Fetch blocked dates/times for this specific date
  const { data: blockedDates } = await supabase
    .from("blocked_dates")
    .select("*")
    .eq("date", dateString);

  // If there's a full-day block, return no slots
  if (blockedDates?.some((b) => !b.start_time && !b.end_time)) {
    return [];
  }

  // 4. Fetch existing bookings on this date
  const { data: bookings } = await supabase
    .from("bookings")
    .select("time, duration")
    .eq("date", dateString)
    .in("status", ["pending", "confirmed"]);

  // 5. Calculate available slots (interval of 30 minutes)
  const slots: string[] = [];
  const openTime = parse(hours.open_time, "HH:mm:ss", date);
  const closeTime = parse(hours.close_time, "HH:mm:ss", date);

  let currentTime = openTime;
  const totalServiceTime = service.duration + (service.buffer_time || 0);

  while (isBefore(currentTime, closeTime)) {
    const slotEndTime = addMinutes(currentTime, totalServiceTime);
    
    // Stop if the service extends beyond closing time
    if (!isBefore(slotEndTime, addMinutes(closeTime, 1))) {
      break;
    }

    const slotStartStr = format(currentTime, "HH:mm:ss");
    const slotEndStr = format(slotEndTime, "HH:mm:ss");

    // Check if slot overlaps with any blocked date times
    let isBlocked = false;
    if (blockedDates) {
      for (const block of blockedDates) {
        if (block.start_time && block.end_time) {
          if (
            (slotStartStr >= block.start_time && slotStartStr < block.end_time) ||
            (slotEndStr > block.start_time && slotEndStr <= block.end_time) ||
            (slotStartStr <= block.start_time && slotEndStr >= block.end_time)
          ) {
            isBlocked = true;
            break;
          }
        }
      }
    }

    // Check if slot overlaps with existing bookings
    if (!isBlocked && bookings) {
      for (const booking of bookings) {
        const bookingStart = booking.time;
        // add duration + service buffer? No, existing booking already includes its own duration, but buffer?
        // Wait, the buffer_time of the EXISTING booking isn't stored in `bookings` currently. 
        // We'll just assume `duration` of the booking is what is blocked.
        const bookingDateStart = parse(bookingStart, "HH:mm:ss", date);
        const bookingDateEnd = addMinutes(bookingDateStart, booking.duration);
        const bookingEndStr = format(bookingDateEnd, "HH:mm:ss");

        if (
          (slotStartStr >= bookingStart && slotStartStr < bookingEndStr) ||
          (slotEndStr > bookingStart && slotEndStr <= bookingEndStr) ||
          (slotStartStr <= bookingStart && slotEndStr >= bookingEndStr)
        ) {
          isBlocked = true;
          break;
        }
      }
    }

    if (!isBlocked) {
      // It's a valid slot! But only add HH:mm
      slots.push(format(currentTime, "HH:mm"));
    }

    // Increment by 30 mins for the next possible slot
    currentTime = addMinutes(currentTime, 30);
  }

  // Filter out past times if the date is today
  const now = new Date();
  if (format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")) {
    const currentStr = format(now, "HH:mm");
    return slots.filter((slot) => slot > currentStr);
  }

  return slots;
}

export async function createBooking(data: {
  serviceId: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}) {
  // Generate a random booking ref e.g. PYL-XXXX
  const bookingRef = `PYL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Get service price and duration
  const { data: service } = await supabase
    .from("services")
    .select("price, duration, deposit_amount")
    .eq("id", data.serviceId)
    .single();

  if (!service) {
    return { error: "Service not found" };
  }

  // Call the transaction RPC
  const { data: bookingId, error } = await supabase.rpc("book_appointment", {
    p_booking_ref: bookingRef,
    p_customer_name: data.customerName,
    p_customer_email: data.customerEmail,
    p_customer_phone: data.customerPhone,
    p_service_id: data.serviceId,
    p_date: data.date,
    p_time: data.time,
    p_duration: service.duration,
    p_notes: data.notes || "",
    p_total_amount: service.price,
    p_deposit_amount: service.deposit_amount,
  });

  if (error) {
    console.error("Booking failed:", error.message);
    return { error: "This slot is no longer available. Please select another time." };
  }

  return { success: true, bookingRef, bookingId };
}
