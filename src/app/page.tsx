"use client";

import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LandingContent from "@/components/LandingContent";

export default function RootPage() {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  if (session) {
    return <div className="min-h-screen bg-[#09090b]" />;
  }

  return <LandingContent />;
}
