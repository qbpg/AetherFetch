import type { Metadata } from "next";
import LegalContent from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Legal Notice | AetherFetch",
  alternates: { canonical: "/legal" },
};

export default function Page() {
  return <LegalContent page="legal" />;
}
