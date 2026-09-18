"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import { getSession } from "@/lib/mailbox";
import AuthForm from "@/components/AuthForm";

export default function HomePage() {
  const { session, setSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace("/dashboard");
  }, [session, router]);

  if (session) return <div className="min-h-screen bg-[#09090b]" />;

  return <AuthForm onAuthenticated={() => setSession(getSession())} />;
}
