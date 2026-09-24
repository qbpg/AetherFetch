import type { Metadata } from "next";
import LegalContent from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Refund Policy | AetherFetch",
  alternates: { canonical: "/refund" },
};

export default function Page() {
  return <LegalContent page="refund" />;
}
