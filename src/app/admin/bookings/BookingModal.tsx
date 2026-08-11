"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { adminCreateBooking, adminUpdateBooking } from "@/app/actions/admin";
import { ServiceDB } from "@/lib/types";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  booking?: any; // If provided, we are editing
  services: ServiceDB[];
};

type FormData = {
  serviceId: string;
  date: string;
  time: string;
  duration: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
};

export default function BookingModal({ isOpen, onClose, onSuccess, booking, services }: BookingModalProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedServiceId = watch("serviceId");

  useEffect(() => {
    if (booking) {
      reset({
        serviceId: booking.service_id,
        date: booking.date,
        time: booking.time.substring(0, 5), // Format HH:MM
        duration: booking.duration,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email || "",
        customerPhone: booking.customer_phone || "",
        notes: booking.notes || "",
      });
    } else {
      reset({
        serviceId: "",
        date: "",
        time: "",
        duration: 60,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        notes: "",
      });
    }
  }, [booking, isOpen, reset]);

  // Auto-fill duration when a service is selected (for new bookings)
  useEffect(() => {
    if (!booking && selectedServiceId) {
      const s = services.find((srv) => srv.id === selectedServiceId);
      if (s && s.duration) {
        setValue("duration", parseInt(s.duration.toString()) || 60);
      }
    }
  }, [selectedServiceId, booking, services, setValue]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      if (booking) {
        // Edit mode
        const res = await adminUpdateBooking(booking.id, {
          service_id: data.serviceId,
          date: data.date,
          time: data.time,
          duration: data.duration,
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_phone: data.customerPhone,
          notes: data.notes,
        });
        if (res.error) throw new Error(res.error);
      } else {
        // Create mode
        const s = services.find((srv) => srv.id === data.serviceId);
        const res = await adminCreateBooking({
          ...data,
          deposit_amount: s?.deposit_amount || 1000,
          total_amount: s?.price || 0,
        });
        if (res.error) throw new Error(res.error);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-plum-500";
  const labelClasses = "block text-xs uppercase tracking-widest text-ash mb-1 mt-4";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-black/5">
          <h2 className="font-serif text-xl text-ink">{booking ? "Edit Booking" : "Add Manual Booking"}</h2>
          <button onClick={onClose} className="text-ash hover:text-ink"><X size={20}/></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
          
          <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Service</label>
                <select className={inputClasses} {...register("serviceId", { required: true })}>
                  <option value="">Select Service</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className={labelClasses}>Duration (mins)</label>
                <input type="number" className={inputClasses} {...register("duration", { required: true, min: 15 })} />
              </div>

              <div>
                <label className={labelClasses}>Date</label>
                <input type="date" className={inputClasses} {...register("date", { required: true })} />
              </div>

              <div>
                <label className={labelClasses}>Time (HH:MM)</label>
                <input type="time" className={inputClasses} {...register("time", { required: true })} />
              </div>
            </div>

            <hr className="border-black/5 my-4" />

            <div>
              <label className={labelClasses}>Customer Name</label>
              <input type="text" className={inputClasses} {...register("customerName", { required: true })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Customer Phone</label>
                <input type="text" className={inputClasses} {...register("customerPhone")} />
              </div>
              <div>
                <label className={labelClasses}>Customer Email</label>
                <input type="email" className={inputClasses} {...register("customerEmail")} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Admin Notes / Customer Request</label>
              <textarea rows={2} className={inputClasses} {...register("notes")} />
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-black/5 bg-cloud flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-ash hover:text-ink">Cancel</button>
          <button 
            form="booking-form" 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-plum-600 text-white text-sm font-medium hover:bg-plum-500 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
