"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { updateService, adminCreateService } from "@/app/actions/admin";

type ServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: any; // If provided, we are editing
};

type FormData = {
  name: string;
  description: string;
  price: number;
  deposit_amount: number;
  duration: number;
  buffer_time: number;
  is_active: boolean;
  sort_order: number;
};

export default function ServiceModal({ isOpen, onClose, onSuccess, service }: ServiceModalProps) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (service) {
      reset({
        name: service.name,
        description: service.description || "",
        price: service.price,
        deposit_amount: service.deposit_amount,
        duration: service.duration,
        buffer_time: service.buffer_time,
        is_active: service.is_active,
        sort_order: service.sort_order || 0,
      });
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        deposit_amount: 1000,
        duration: 60,
        buffer_time: 15,
        is_active: true,
        sort_order: 0,
      });
    }
  }, [service, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      if (service) {
        // Edit mode
        const res = await updateService(service.id, data);
        if (res.error) throw new Error(res.error);
      } else {
        // Create mode
        const res = await adminCreateService(data);
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
          <h2 className="font-serif text-xl text-ink">{service ? "Edit Service" : "Add New Service"}</h2>
          <button onClick={onClose} className="text-ash hover:text-ink"><X size={20}/></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
          
          <form id="service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div>
              <label className={labelClasses}>Service Name</label>
              <input type="text" className={inputClasses} {...register("name", { required: true })} />
            </div>

            <div>
              <label className={labelClasses}>Description</label>
              <textarea rows={2} className={inputClasses} {...register("description")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Price (₦)</label>
                <input type="number" className={inputClasses} {...register("price", { required: true, valueAsNumber: true })} />
              </div>
              
              <div>
                <label className={labelClasses}>Deposit Amount (₦)</label>
                <input type="number" className={inputClasses} {...register("deposit_amount", { required: true, valueAsNumber: true })} />
              </div>

              <div>
                <label className={labelClasses}>Duration (mins)</label>
                <input type="number" className={inputClasses} {...register("duration", { required: true, min: 15, valueAsNumber: true })} />
              </div>

              <div>
                <label className={labelClasses}>Buffer Time (mins)</label>
                <input type="number" className={inputClasses} {...register("buffer_time", { required: true, min: 0, valueAsNumber: true })} />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6 p-4 bg-cloud rounded-xl">
              <input 
                type="checkbox" 
                id="is_active" 
                className="w-4 h-4 text-plum-600 rounded border-gray-300 focus:ring-plum-500"
                {...register("is_active")}
              />
              <label htmlFor="is_active" className="text-sm font-medium text-ink cursor-pointer flex-1">
                Active (Visible to customers)
              </label>
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-black/5 bg-cloud flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-ash hover:text-ink">Cancel</button>
          <button 
            form="service-form" 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-plum-600 text-white text-sm font-medium hover:bg-plum-500 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Service"}
          </button>
        </div>
      </div>
    </div>
  );
}
