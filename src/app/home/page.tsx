"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { getSession } from "@/lib/mailbox";
import AuthForm from "@/components/AuthForm";
import SessionSelector from "@/components/SessionSelector";

type HomeView = "selector" | "auth";

function getInitialView(hasSession: boolean): HomeView {
  if (hasSession) return "auth";
  if (typeof window === "undefined") return "auth";
  const stored = getSession();
  return stored ? "selector" : "auth";
}

export default function HomePage() {
  const { session, setSession } = useSession();
  const router = useRouter();
  const [view, setView] = useState<HomeView>(() => getInitialView(!!session));

  if (session) {
    router.replace("/dashboard");
    return <div className="min-h-screen bg-[#09090b]" />;
  }

  if (view === "selector") {
    return (
      <SessionSelector
        onContinue={() => {
          const s = getSession();
          if (s) {
            setSession(s);
            router.push("/dashboard");
          }
        }}
        onNewMailbox={() => setView("auth")}
      />
    );
  }

  return <AuthForm onAuthenticated={() => setSession(getSession())} />;
}
