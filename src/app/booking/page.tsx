import { BookingForm } from "./BookingForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BOOKING_DEPOSIT } from "@/lib/constants";
import { Info } from "lucide-react";

export const metadata = {
  title: "Book Appointment | PY Luxe — Hair, Nails, Makeup & Henna in Abuja",
  description: "Book your beauty appointment with PY Luxe in Abuja. A ₦1,000 deposit is required to secure every appointment.",
};

export default function BookingPage() {
  return (
    <main>
      <section className="bg-noir px-5 py-14 text-center sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="Booking"
            title="Book your appointment"
            subtitle={`A ${BOOKING_DEPOSIT} deposit is required to secure every appointment. Fill in your details below and PY Luxe will receive your request on WhatsApp.`}
            light
          />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl">
          {/* Policy Banner */}
          <div className="mb-10 rounded-2xl border border-plum-200 bg-plum-50 p-6 text-sm text-plum-900">
            <div className="flex items-start gap-3">
              <Info size={18} className="mt-0.5 shrink-0 text-plum-600" />
              <div className="space-y-2">
                <p className="font-semibold text-plum-800">Important Booking Policy:</p>
                <ul className="list-disc pl-4 space-y-1 text-ash">
                  <li>A <strong>{BOOKING_DEPOSIT} deposit</strong> is required to secure every appointment.</li>
                  <li>Your appointment is only confirmed after the deposit has been received and verified by PY Luxe.</li>
                  <li>After payment, please send your payment screenshot on WhatsApp for confirmation.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-cloud p-6 sm:p-10 shadow-soft">
            <BookingForm />
          </div>
        </div>
      </section>
    </main>
  );
}
