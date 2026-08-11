"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { updateBookingStatus, adminDeleteBooking } from "@/app/actions/admin";
import BookingModal from "./BookingModal";
import { ServiceDB } from "@/lib/types";

export default function BookingsTable({ initialBookings, services }: { initialBookings: any[], services: ServiceDB[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    await updateBookingStatus(id, newStatus);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking completely?")) {
      setBookings(prev => prev.filter(b => b.id !== id));
      await adminDeleteBooking(id);
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
    // Ideally we would fetch the latest bookings, but since this is a client component wrapped in a server page,
    // the easiest way to refresh is to reload the page or use router.refresh().
    window.location.reload(); 
  };

  return (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-serif text-ink">All Bookings</h1>
          <p className="text-ash mt-2">Manage customer appointments, status, and payments.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-ink text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide hover:bg-black transition-colors"
        >
          + Add Booking
        </button>
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
              {bookings?.map((booking) => (
                <tr key={booking.id} className="hover:bg-cloud/50">
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
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEditModal(booking)} className="text-plum-600 hover:text-plum-800 font-medium text-xs uppercase tracking-wider">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(booking.id)} className="text-red-500 hover:text-red-700 font-medium text-xs uppercase tracking-wider">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!bookings || bookings.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-ash">No bookings found.</td>
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
