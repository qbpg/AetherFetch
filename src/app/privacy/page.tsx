import type { Metadata } from "next";
import LegalContent from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Privacy Policy | AetherFetch",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalContent page="privacy" />;
}
