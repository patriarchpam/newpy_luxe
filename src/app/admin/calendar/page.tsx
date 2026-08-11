import { getAdminBookings } from "@/app/actions/admin";
import { format, parseISO, startOfWeek, addDays, getHours } from "date-fns";

export default async function AdminCalendarPage() {
  const bookings = await getAdminBookings();

  // A very simple weekly calendar view
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  const hours = Array.from({ length: 11 }).map((_, i) => i + 8); // 8 AM to 6 PM

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-serif text-ink">Calendar</h1>
        <p className="text-ash mt-2">Weekly view of all appointments.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-x-auto flex-1 flex flex-col">
        <div className="min-w-[800px] flex-1">
          {/* Header */}
          <div className="grid grid-cols-8 border-b border-black/5 bg-cloud">
            <div className="p-4 border-r border-black/5 text-center text-xs font-medium text-ash">
              Time
            </div>
            {weekDays.map(day => (
              <div key={day.toISOString()} className="p-4 border-r border-black/5 text-center">
                <p className="text-xs uppercase tracking-widest text-ash">{format(day, "EEE")}</p>
                <p className="text-lg font-serif text-ink">{format(day, "d")}</p>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="relative">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-black/5 h-24">
                <div className="p-2 border-r border-black/5 text-xs text-ash text-right">
                  {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                </div>
                {weekDays.map(day => (
                  <div key={day.toISOString()} className="border-r border-black/5 relative">
                    {/* Check if any bookings start in this hour on this day */}
                    {bookings?.filter(b => {
                      const d = parseISO(b.date);
                      return d.getDate() === day.getDate() && 
                             d.getMonth() === day.getMonth() &&
                             parseInt(b.time.split(":")[0]) === hour;
                    }).map(booking => {
                      const minutes = parseInt(booking.time.split(":")[1]);
                      const top = (minutes / 60) * 100;
                      const height = (booking.duration / 60) * 100;

                      return (
                        <div 
                          key={booking.id}
                          className="absolute left-1 right-1 rounded-md p-2 text-xs overflow-hidden shadow-sm z-10 bg-plum-100 border border-plum-200"
                          style={{
                            top: `${top}%`,
                            height: `${height}%`,
                            minHeight: '2rem'
                          }}
                        >
                          <p className="font-semibold text-plum-900 leading-tight">{booking.customer_name}</p>
                          <p className="text-plum-700 leading-tight">{booking.service?.name}</p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
