"use client";

import { useSession } from "@/contexts/SessionContext";
import { getSession } from "@/lib/mailbox";
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  const { setSession } = useSession();

  return <AuthForm initialMode="register" onAuthenticated={() => setSession(getSession())} />;
}
