"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import { getSession } from "@/lib/mailbox";
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  const { session, setSession } = useSession();
  const router = useRouter();

  if (session) {
    router.replace("/dashboard");
    return <div className="min-h-screen bg-[#09090b]" />;
  }

  return <AuthForm initialMode="register" onAuthenticated={() => setSession(getSession())} />;
}
