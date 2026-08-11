"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { updateBookingStatus, adminDeleteBooking, adminRecoverBooking } from "@/app/actions/admin";
import BookingModal from "./BookingModal";
import { ServiceDB } from "@/lib/types";

export default function BookingsTable({ 
  initialBookings, 
  initialArchivedBookings,
  services 
}: { 
  initialBookings: any[], 
  initialArchivedBookings: any[],
  services: ServiceDB[] 
}) {
  const [activeBookings, setActiveBookings] = useState(initialBookings);
  const [archivedBookings, setArchivedBookings] = useState(initialArchivedBookings);
  const [view, setView] = useState<"active" | "archived">("active");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);

  const currentBookings = view === "active" ? activeBookings : archivedBookings;

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActiveBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    await updateBookingStatus(id, newStatus);
  };

  const handleDelete = async (booking: any) => {
    if (confirm("Are you sure you want to delete this booking? It will be moved to the Archived view.")) {
      setActiveBookings(prev => prev.filter(b => b.id !== booking.id));
      setArchivedBookings(prev => [booking, ...prev]);
      await adminDeleteBooking(booking.id);
    }
  };

  const handleRecover = async (booking: any) => {
    if (confirm("Are you sure you want to recover this booking?")) {
      setArchivedBookings(prev => prev.filter(b => b.id !== booking.id));
      setActiveBookings(prev => [booking, ...prev]);
      await adminRecoverBooking(booking.id);
    }
  };

  const openEditModal = (booking: any) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingBooking(null);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    window.location.reload(); 
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-ink">Bookings Hub</h1>
          <p className="text-ash mt-2">Manage customer appointments, status, and payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-cloud p-1 rounded-full flex gap-1">
            <button 
              onClick={() => setView("active")}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${view === "active" ? "bg-white text-ink shadow-sm" : "text-ash hover:text-ink"}`}
            >
              Active
            </button>
            <button 
              onClick={() => setView("archived")}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${view === "archived" ? "bg-white text-ink shadow-sm" : "text-ash hover:text-ink"}`}
            >
              Archived
            </button>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-ink text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide hover:bg-black transition-colors"
          >
            + Add Booking
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-cloud text-ash text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Ref / Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {currentBookings?.map((booking) => (
                <tr key={booking.id} className={`hover:bg-cloud/50 ${view === 'archived' ? 'opacity-70' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-mono text-plum-600 font-bold">{booking.booking_ref}</p>
                    <p className="text-ink font-medium">{format(parseISO(booking.date), "MMM d, yyyy")}</p>
                    <p className="text-ash text-xs">{booking.time.substring(0, 5)} ({booking.duration}m)</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">{booking.customer_name}</p>
                    <p className="text-ash text-xs">{booking.customer_phone}</p>
                    <p className="text-ash text-xs">{booking.customer_email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-ink font-medium">{booking.service?.name}</p>
                    {booking.notes && <p className="text-ash text-xs mt-1 max-w-[200px] truncate" title={booking.notes}>Note: {booking.notes}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">₦{(booking.total_amount || 0).toLocaleString()}</p>
                    <p className="text-ash text-xs">Dep: ₦{(booking.deposit_amount || 1000).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    {view === "active" ? (
                      <select 
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`text-xs font-medium uppercase tracking-wider p-2 rounded-lg border outline-none ${
                          booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                          booking.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          booking.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className="text-xs font-medium uppercase tracking-wider p-2 rounded-lg bg-gray-100 text-gray-500">
                        Deleted
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {view === "active" ? (
                        <>
                          <button onClick={() => openEditModal(booking)} className="text-plum-600 hover:text-plum-800 font-medium text-xs uppercase tracking-wider">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(booking)} className="text-red-500 hover:text-red-700 font-medium text-xs uppercase tracking-wider">
                            Delete
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleRecover(booking)} className="text-green-600 hover:text-green-800 font-medium text-xs uppercase tracking-wider">
                          Recover
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {(!currentBookings || currentBookings.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-ash">No {view} bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess}
        booking={editingBooking}
        services={services}
      />
    </>
  );
}
