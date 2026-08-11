"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MessageCircle, Clock, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { whatsappLink } from "@/lib/utils";
import { BRAND, BOOKING_DEPOSIT } from "@/lib/constants";
import { getAvailableSlots, createBooking } from "@/app/actions/booking";

import { ServiceDB } from "@/lib/types";

type BookingFormData = {
  fullName: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  time: string;
  message: string;
};

// Animation variants for smooth step transitions
const stepVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

export function BookingForm({ initialServices }: { initialServices: ServiceDB[] }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ ref?: string; error?: string } | null>(null);

  const selectedServiceId = watch("serviceId");
  const selectedDate = watch("date");
  const selectedTime = watch("time");

  const selectedService = initialServices.find(s => s.id === selectedServiceId);

  // Fetch availability when date changes
  useEffect(() => {
    async function fetchSlots() {
      if (selectedServiceId && selectedDate) {
        setIsLoadingSlots(true);
        setValue("time", ""); // Reset time
        try {
          const slots = await getAvailableSlots(selectedDate, selectedServiceId);
          setAvailableSlots(slots);
        } catch (error) {
          console.error(error);
          setAvailableSlots([]);
        } finally {
          setIsLoadingSlots(false);
        }
      }
    }
    fetchSlots();
  }, [selectedDate, selectedServiceId, setValue]);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setBookingResult(null);

    const result = await createBooking({
      serviceId: data.serviceId,
      date: data.date,
      time: data.time,
      customerName: data.fullName,
      customerEmail: data.email,
      customerPhone: data.phone,
      notes: data.message,
    });

    if (result.error) {
      setBookingResult({ error: result.error });
      setIsSubmitting(false);
    } else {
      setBookingResult({ ref: result.bookingRef });
      setStep(4);
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-plum-500 font-sans";
  const labelClasses = "block text-xs uppercase tracking-[0.16em] text-ash mb-2 font-medium";

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
            <h3 className="text-xl font-serif text-ink mb-4">Step 1: Select a Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialServices.filter(s => s.is_active).map((service, idx) => (
                <motion.label
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${selectedServiceId === service.id ? 'border-plum-500 bg-plum-50 shadow-md' : 'border-transparent bg-white shadow-sm hover:shadow-md hover:border-plum-200'}`}
                >
                  <input 
                    type="radio" 
                    value={service.id} 
                    className="hidden" 
                    {...register("serviceId", { required: true })} 
                  />
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-ink">{service.name}</span>
                    <span className="text-plum-600 font-medium text-xs">Price varies</span>
                  </div>
                  <p className="text-xs text-ash mb-3">{service.description}</p>
                  <div className="flex items-center gap-4 text-xs text-ink/70">
                    <span className="flex items-center gap-1"><Clock size={14}/> {service.duration} mins</span>
                    <span className="font-medium text-plum-600">Deposit: {BOOKING_DEPOSIT}</span>
                  </div>
                </motion.label>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button 
                type="button"
                disabled={!selectedServiceId}
                onClick={() => setStep(2)}
                className="h-12 rounded-full bg-ink px-8 text-xs uppercase tracking-[0.2em] text-white hover:bg-black transition-colors font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setStep(1)} className="text-ash hover:text-ink transition-colors"><ArrowLeft size={20}/></button>
              <h3 className="text-xl font-serif text-ink">Step 2: Date & Time</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="date" className={labelClasses}>Select Date</label>
                <input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className={inputClasses}
                  {...register("date", { required: true })}
                />
              </div>

              <div>
                <label className={labelClasses}>Available Times</label>
                {!selectedDate ? (
                  <p className="text-sm text-ash py-4">Please select a date first.</p>
                ) : isLoadingSlots ? (
                  <p className="text-sm text-ash py-4 animate-pulse">Checking availability...</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-red-500 py-4">No available slots on this date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot, idx) => (
                      <motion.label 
                        key={slot}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className={`cursor-pointer rounded-xl border p-3 text-center text-sm font-medium transition-colors ${selectedTime === slot ? 'border-plum-500 bg-plum-50 text-plum-700 shadow-sm' : 'border-black/10 bg-white hover:border-plum-300'}`}
                      >
                        <input type="radio" value={slot} className="hidden" {...register("time", { required: true })} />
                        {slot}
                      </motion.label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button 
                type="button"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(3)}
                className="h-12 rounded-full bg-ink px-8 text-xs uppercase tracking-[0.2em] text-white hover:bg-black transition-colors font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.form key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <button type="button" onClick={() => setStep(2)} className="text-ash hover:text-ink transition-colors"><ArrowLeft size={20}/></button>
              <h3 className="text-xl font-serif text-ink">Step 3: Your Details</h3>
            </div>

            {bookingResult?.error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 rounded-xl bg-red-50 text-red-600 text-sm mb-6 border border-red-100 overflow-hidden">
                {bookingResult.error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className={labelClasses}>Full Name *</label>
                <input id="fullName" type="text" className={inputClasses} {...register("fullName", { required: "Name is required" })} />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
                <input id="phone" type="tel" className={inputClasses} {...register("phone", { required: "Phone is required" })} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="email" className={labelClasses}>Email Address *</label>
                <input id="email" type="email" className={inputClasses} {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="message" className={labelClasses}>Additional Notes (Optional)</label>
                <textarea id="message" rows={3} className={inputClasses} {...register("message")} />
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm mt-8"
            >
              <h4 className="font-serif text-lg mb-4">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-ash">Service:</span> <span className="font-medium">{selectedService?.name}</span></div>
                <div className="flex justify-between"><span className="text-ash">Date:</span> <span className="font-medium">{selectedDate}</span></div>
                <div className="flex justify-between"><span className="text-ash">Time:</span> <span className="font-medium">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-ash">Duration:</span> <span className="font-medium">{selectedService?.duration} mins</span></div>
                <div className="pt-4 mt-4 border-t border-black/5 flex justify-between text-base">
                  <span className="font-semibold">Total Price:</span> <span className="font-semibold text-sm">Varies by service</span>
                </div>
                <div className="flex justify-between text-plum-600 font-medium">
                  <span>Required Deposit:</span> <span>{BOOKING_DEPOSIT}</span>
                </div>
              </div>
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 mt-8 rounded-full bg-plum-500 px-8 text-xs uppercase tracking-[0.2em] text-white hover:bg-plum-400 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? "Confirming..." : "Confirm Booking"}
            </motion.button>
          </motion.form>
        )}

        {step === 4 && (
          <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="text-center py-8 space-y-6">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 size={32} />
            </motion.div>
            <h3 className="text-3xl font-serif text-ink">Booking Confirmed!</h3>
            <p className="text-ash">Your appointment has been successfully reserved.</p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block p-4 rounded-xl bg-white border border-black/10 shadow-sm mt-4 mb-8"
            >
              <p className="text-xs uppercase tracking-widest text-ash mb-1">Reference Number</p>
              <p className="text-2xl font-mono font-bold text-plum-600">{bookingResult?.ref}</p>
            </motion.div>

            <p className="text-sm text-ink max-w-md mx-auto mb-8">
              To finalize your booking, a deposit of <strong>{BOOKING_DEPOSIT}</strong> is required. Please tap below to message us on WhatsApp for payment instructions.
            </p>

            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={whatsappLink(BRAND.whatsapp, `Hello PY Luxe! 💕\n\nI have just booked an appointment and would like to make my deposit.\n\nBooking Ref: ${bookingResult?.ref}\nService: ${selectedService?.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\n\nThank you!`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 rounded-full bg-[#25D366] px-8 text-xs uppercase tracking-[0.2em] text-white hover:bg-[#20bd5a] transition-colors font-semibold items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> Complete Deposit via WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
