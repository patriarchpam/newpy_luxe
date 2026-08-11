import { getAdminBookings } from "@/app/actions/admin";
import { format, parseISO } from "date-fns";

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-ink">All Bookings</h1>
          <p className="text-ash mt-2">Manage customer appointments, status, and payments.</p>
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
                <th className="px-6 py-4 font-medium">Action</th>
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
                    <p className="font-medium text-ink">₦{booking.total_amount.toLocaleString()}</p>
                    <p className="text-ash text-xs">Dep: ₦{booking.deposit_amount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {/* In a real app, this would be an interactive dropdown calling updateBookingStatus */}
                    <select className="text-xs border rounded p-1">
                      <option>Update Status</option>
                      <option value="confirmed">Confirm</option>
                      <option value="cancelled">Cancel</option>
                      <option value="completed">Complete</option>
                    </select>
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
    </div>
  );
}
