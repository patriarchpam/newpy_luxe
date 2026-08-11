import { getAdminBookings, getAdminServices } from "@/app/actions/admin";
import BookingsTable from "./BookingsTable";

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();
  const services = await getAdminServices();

  return (
    <div className="space-y-8">
      <BookingsTable initialBookings={bookings || []} services={services || []} />
    </div>
  );
}
