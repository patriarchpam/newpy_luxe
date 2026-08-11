import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryClient } from "./GalleryClient";

export const metadata = {
  title: "Gallery | PY Luxe — Hair, Nails, Makeup & Henna in Abuja",
  description: "A look at the PY Luxe beauty style — hair, nails, makeup and henna imagery.",
};

export default function GalleryPage() {
  return (
    <main>
      <section className="bg-noir px-5 py-14 text-center sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="Gallery"
            title="The PY Luxe look book"
            subtitle="Explore our real portfolio of client work and brand imagery across hair, nails, makeup and henna."
            light
          />
        </div>
      </section>

      <section className="bg-white px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <GalleryClient />
        </div>
      </section>
    </main>
  );
}
