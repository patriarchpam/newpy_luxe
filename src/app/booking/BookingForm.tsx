"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { MessageCircle } from "lucide-react";
import { SERVICES, BRAND } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

type BookingFormData = {
  fullName: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  location: string;
  message: string;
};

export function BookingForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: BookingFormData) => {
    setIsSubmitting(true);
    
    const selectedService = SERVICES.find(s => s.id === data.service)?.name || data.service;

    const message = `Hello PY Luxe! 💕

I would like to book an appointment.

Name: ${data.fullName}
Phone: ${data.phone}
Service: ${selectedService}
Preferred Date: ${data.date}
Preferred Time: ${data.time}
Location: ${data.location}

I understand that a ₦1,000 deposit is required to secure my appointment.

Additional Message: ${data.message || "None"}

Thank you!`;

    const url = whatsappLink(BRAND.whatsapp, message);
    window.open(url, "_blank");
    
    setIsSubmitting(false);
  };

  const inputClasses = "w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-plum-500 font-sans";
  const labelClasses = "block text-xs uppercase tracking-[0.16em] text-ash mb-2 font-medium";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className={labelClasses}>Full Name *</label>
          <input
            id="fullName"
            type="text"
            placeholder="Your name"
            className={inputClasses}
            {...register("fullName", { required: "Name is required" })}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
          <input
            id="phone"
            type="tel"
            placeholder="070 0000 0000"
            className={inputClasses}
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="service" className={labelClasses}>Select Service *</label>
        <select
          id="service"
          className={inputClasses}
          {...register("service", { required: "Please select a service" })}
          defaultValue=""
        >
          <option value="" disabled>Choose a service</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>{s.name} - {s.price}</option>
          ))}
        </select>
        {errors.service && <p className="text-red-500 text-xs mt-1.5">{errors.service.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className={labelClasses}>Preferred Date *</label>
          <input
            id="date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className={inputClasses}
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1.5">{errors.date.message}</p>}
        </div>

        <div>
          <label htmlFor="time" className={labelClasses}>Preferred Time *</label>
          <input
            id="time"
            type="time"
            className={inputClasses}
            {...register("time", { required: "Time is required" })}
          />
          {errors.time && <p className="text-red-500 text-xs mt-1.5">{errors.time.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="location" className={labelClasses}>Location *</label>
        <select
          id="location"
          className={inputClasses}
          {...register("location", { required: "Please select a location" })}
          defaultValue=""
        >
          <option value="" disabled>Choose location</option>
          <option value={BRAND.primary_service_location}>{BRAND.primary_service_location}</option>
          <option value="Home Service">Home Service</option>
        </select>
        {errors.location && <p className="text-red-500 text-xs mt-1.5">{errors.location.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>Additional Message (Optional)</label>
        <textarea
          id="message"
          rows={4}
          placeholder="Any special requests or details..."
          className={inputClasses}
          {...register("message")}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 rounded-full bg-plum-500 px-8 text-[12px] uppercase tracking-[0.2em] text-white hover:bg-plum-400 transition-colors font-semibold flex items-center justify-center gap-2 shadow-soft disabled:opacity-70"
      >
        <MessageCircle size={18} />
        Send Booking Request via WhatsApp
      </button>

      <div className="mt-12 pt-8 border-t border-black/10 text-center">
        <h3 className="font-serif text-xl text-ink mb-2">Already paid your deposit?</h3>
        <p className="text-ash text-sm mb-6">
          If you have already made your ₦1,000 deposit, send your payment screenshot directly for confirmation.
        </p>
        <a
          href={whatsappLink(BRAND.whatsapp, `Hello PY Luxe! 💕\n\nI have made my ₦1,000 booking deposit.\n\nI have attached my payment screenshot for verification.\n\nThank you!`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/20 px-8 text-[12px] uppercase tracking-[0.18em] text-ink hover:border-plum-500 hover:text-plum-600 font-medium"
        >
          Send Payment Proof on WhatsApp
        </a>
      </div>
    </form>
  );
}
