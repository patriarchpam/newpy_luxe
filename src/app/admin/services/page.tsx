import { getAdminServices } from "@/app/actions/admin";
import ServicesManager from "./ServicesManager";

export default async function AdminServicesPage() {
  const services = await getAdminServices();

  return (
    <div>
      <ServicesManager initialServices={services || []} />
    </div>
  );
}
