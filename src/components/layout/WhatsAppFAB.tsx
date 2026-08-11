"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

export function WhatsAppFAB({ phoneNumber }: { phoneNumber?: string }) {
  const link = whatsappLink(
    phoneNumber || BRAND.whatsapp,
    "Hello PY Luxe! 💕 I'd like to make an enquiry."
  );

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with PY Luxe on WhatsApp"
      className="fixed bottom-20 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-plum-500 text-white shadow-soft ring-1 ring-white/20 transition-transform duration-200 hover:scale-105 hover:bg-plum-400 md:bottom-6 md:right-6"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
    >
      <MessageCircle size={24} />
    </motion.a>
  );
}
