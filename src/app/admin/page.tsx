import { getAdminBookings } from "@/app/actions/admin";
import { format, isToday } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const allBookings = await getAdminBookings();

  const todaysBookings = allBookings?.filter(b => isToday(new Date(b.date))) || [];
  
  const totalBookings = todaysBookings.length;
  const confirmed = todaysBookings.filter(b => b.status === "confirmed").length;
  const pending = todaysBookings.filter(b => b.status === "pending").length;
  
  const expectedRevenue = todaysBookings.reduce((sum, b) => sum + Number(b.total_amount), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-ink">Dashboard</h1>
        <p className="text-ash mt-2">Overview of today&apos;s appointments and revenue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-ash mb-2">Today&apos;s Appointments</p>
          <p className="text-3xl font-serif text-ink">{totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-ash mb-2">Confirmed</p>
          <p className="text-3xl font-serif text-green-600">{confirmed}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-ash mb-2">Pending</p>
          <p className="text-3xl font-serif text-orange-500">{pending}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-ash mb-2">Expected Revenue</p>
          <p className="text-3xl font-serif text-plum-600">₦{expectedRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5">
          <h2 className="font-serif text-xl">Today&apos;s Schedule</h2>
        </div>
        <div className="p-0">
          {todaysBookings.length === 0 ? (
            <p className="p-6 text-ash text-sm">No appointments scheduled for today.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-cloud text-ash text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {todaysBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-cloud/50">
                    <td className="px-6 py-4 font-medium text-ink">{booking.time.substring(0, 5)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{booking.customer_name}</p>
                      <p className="text-ash text-xs">{booking.customer_phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      {booking.service?.name}
                      <span className="block text-xs text-ash">{booking.duration} mins</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
