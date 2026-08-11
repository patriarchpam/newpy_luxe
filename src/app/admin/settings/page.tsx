import { getBusinessHours, getBlockedDates } from "@/app/actions/admin";
import BusinessHoursManager from "./BusinessHoursManager";
import BlockedDatesManager from "./BlockedDatesManager";

export default async function AdminSettingsPage() {
  const businessHours = await getBusinessHours();
  const blockedDates = await getBlockedDates();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-ink">Settings</h1>
        <p className="text-ash mt-2">Manage business hours and blocked dates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BusinessHoursManager initialHours={businessHours || []} />
        <BlockedDatesManager initialDates={blockedDates || []} />
      </div>
    </div>
  );
}
