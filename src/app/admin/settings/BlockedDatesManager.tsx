"use client";

import { useState } from "react";
import { addBlockedDate, removeBlockedDate } from "@/app/actions/admin";

export default function BlockedDatesManager({ initialDates }: { initialDates: any[] }) {
  const [dates, setDates] = useState(initialDates);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newDate, setNewDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;

    setIsSubmitting(true);
    try {
      const data = {
        date: newDate,
        start_time: startTime || undefined,
        end_time: endTime || undefined,
        reason: reason || undefined,
      };

      const res = await addBlockedDate(data);
      if (res.error) throw new Error(res.error);
      
      // Reload to get the new DB ID (easier than complex state syncing)
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to block date");
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    setDates(prev => prev.filter(d => d.id !== id));
    await removeBlockedDate(id);
  };

  const inputClasses = "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-plum-500";

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl">Blocked Dates</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-xs bg-ink text-white px-4 py-2 rounded-full uppercase tracking-wider font-medium hover:bg-black"
          >
            + Block Date
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-6 bg-cloud p-4 rounded-xl border border-black/5 space-y-4">
          <h3 className="font-medium text-sm">Add New Blocked Date</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-ash mb-1">Date *</label>
              <input type="date" required value={newDate} onChange={e => setNewDate(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="block text-xs text-ash mb-1">Reason (Optional)</label>
              <input type="text" placeholder="e.g. Vacation" value={reason} onChange={e => setReason(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="block text-xs text-ash mb-1">Start Time (Optional)</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="block text-xs text-ash mb-1">End Time (Optional)</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputClasses} />
            </div>
          </div>
          
          <p className="text-xs text-ash italic">Note: Leave times empty to block the entire day.</p>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsAdding(false)} className="text-sm font-medium text-ash hover:text-ink px-4 py-2">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="text-sm font-medium bg-plum-600 text-white rounded-lg px-6 py-2 hover:bg-plum-500 disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
      
      <div className="space-y-4">
        {dates?.length === 0 ? (
          <p className="text-sm text-ash">No dates are currently blocked.</p>
        ) : (
          dates?.map((b) => (
            <div key={b.id} className="p-4 border rounded-xl border-red-100 bg-red-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-red-900">{b.date}</p>
                  <p className="text-sm text-red-700 mt-1">
                    {b.start_time && b.end_time 
                      ? `${b.start_time.substring(0,5)} - ${b.end_time.substring(0,5)}` 
                      : "All Day"}
                  </p>
                  {b.reason && <p className="text-xs text-red-600 mt-2">Reason: {b.reason}</p>}
                </div>
                <button onClick={() => handleRemove(b.id)} className="text-xs text-red-500 font-medium uppercase tracking-wider hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
