import { getBusinessHours, getBlockedDates } from "@/app/actions/admin";

export default async function AdminSettingsPage() {
  const businessHours = await getBusinessHours();
  const blockedDates = await getBlockedDates();

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-ink">Settings</h1>
        <p className="text-ash mt-2">Manage business hours and blocked dates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Business Hours */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
          <h2 className="font-serif text-xl mb-6">Business Hours</h2>
          <div className="space-y-4">
            {businessHours?.map((hour) => (
              <div key={hour.id} className="flex items-center justify-between p-3 border rounded-xl">
                <div className="w-24 font-medium">{days[hour.day_of_week]}</div>
                {hour.is_closed ? (
                  <div className="text-red-500 text-sm font-medium">Closed</div>
                ) : (
                  <div className="text-sm font-mono text-ink bg-cloud px-3 py-1 rounded-md">
                    {hour.open_time.substring(0, 5)} - {hour.close_time.substring(0, 5)}
                  </div>
                )}
                <button className="text-xs text-plum-600 font-medium uppercase tracking-wider hover:underline">
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl">Blocked Dates</h2>
            <button className="text-xs bg-ink text-white px-4 py-2 rounded-full uppercase tracking-wider font-medium hover:bg-black">
              + Block Date
            </button>
          </div>
          
          <div className="space-y-4">
            {blockedDates?.length === 0 ? (
              <p className="text-sm text-ash">No dates are currently blocked.</p>
            ) : (
              blockedDates?.map((b) => (
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
                    <button className="text-xs text-red-500 font-medium uppercase hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
