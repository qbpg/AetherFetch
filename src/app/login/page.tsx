"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import { getSession } from "@/lib/mailbox";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useSession();

  return (
    <AuthForm
      initialMode="login"
      onAuthenticated={() => {
        setSession(getSession());
        router.push("/dashboard");
      }}
    />
  );
}
