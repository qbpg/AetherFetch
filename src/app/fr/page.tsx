import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AetherFetch — Mail temporaire gratuit",
  description: "Créez une adresse mail temporaire gratuite avec AetherFetch. Recevez vos codes de vérification, lisez vos messages et gérez plusieurs boîtes jetables.",
  alternates: {
    canonical: "/fr",
    languages: { en: "/", fr: "/fr", "x-default": "/" },
  },
  openGraph: {
    title: "AetherFetch — Mail temporaire gratuit",
    description: "Une adresse mail jetable pour recevoir vos messages et codes de vérification.",
    url: "https://aetherfetch.vercel.app/fr",
    locale: "fr_FR",
    type: "website",
  },
};

export default function FrenchPage() {
  return (
    <main lang="fr" className="flex-1 overflow-y-auto bg-[#09090b] px-5 py-16 text-zinc-100">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-12 text-sm text-zinc-400">
          <Link href="/" lang="en" className="hover:text-white">English</Link>
        </nav>
        <p className="mb-4 text-sm font-medium text-indigo-300">AetherFetch</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">Une adresse mail temporaire, quand vous en avez besoin.</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400">
          Créez un mail temporaire gratuit pour recevoir un code de vérification ou un message ponctuel, sans encombrer votre boîte principale.
          AetherFetch vous permet de retrouver plusieurs adresses et de lire leurs messages depuis une même interface.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">Créer une adresse</Link>
          <Link href="/login" className="rounded-lg border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 hover:bg-zinc-800">Ouvrir ma boîte</Link>
        </div>

        <section className="mt-20 border-t border-zinc-800 pt-10">
          <h2 className="text-2xl font-semibold">Comment ça marche ?</h2>
          <ol className="mt-6 grid gap-5 sm:grid-cols-3">
            <li className="rounded-lg border border-zinc-800 bg-zinc-900 p-5"><strong className="block text-zinc-100">1. Créez</strong><span className="mt-2 block text-sm leading-6 text-zinc-400">Générez une adresse jetable en quelques secondes.</span></li>
            <li className="rounded-lg border border-zinc-800 bg-zinc-900 p-5"><strong className="block text-zinc-100">2. Recevez</strong><span className="mt-2 block text-sm leading-6 text-zinc-400">Utilisez-la pour recevoir un message ou un code.</span></li>
            <li className="rounded-lg border border-zinc-800 bg-zinc-900 p-5"><strong className="block text-zinc-100">3. Consultez</strong><span className="mt-2 block text-sm leading-6 text-zinc-400">Lisez le message, copiez le code et passez à autre chose.</span></li>
          </ol>
        </section>

        <section className="mt-16 border-t border-zinc-800 pt-10">
          <h2 className="text-2xl font-semibold">Questions fréquentes</h2>
          <div className="mt-6 space-y-7 text-sm leading-6">
            <div><h3 className="font-medium text-zinc-100">Qu’est-ce qu’un mail temporaire ?</h3><p className="mt-1 text-zinc-400">C’est une adresse utilisée pour recevoir des messages pendant une courte période. Elle convient aux inscriptions ponctuelles, mais pas aux comptes importants.</p></div>
            <div><h3 className="font-medium text-zinc-100">Puis-je retrouver mes adresses ?</h3><p className="mt-1 text-zinc-400">Oui, les comptes enregistrés et leurs identifiants restent dans le stockage local de ce navigateur. Ils peuvent disparaître si vous effacez les données du site.</p></div>
            <div><h3 className="font-medium text-zinc-100">Qui reçoit les messages ?</h3><p className="mt-1 text-zinc-400">AetherFetch utilise actuellement mail.tm pour les adresses et la réception des messages. Leur disponibilité dépend de ce service.</p></div>
          </div>
        </section>

        <footer className="mt-16 flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-800 py-6 text-xs text-zinc-500">
          <span>Created by qbpg</span>
          <Link href="/legal" className="hover:text-zinc-200">Legal Notice</Link>
          <Link href="/privacy" className="hover:text-zinc-200">Privacy Policy</Link>
          <a href="mailto:qbpg.sg@outlook.com" className="hover:text-zinc-200">qbpg.sg@outlook.com</a>
        </footer>
      </div>
    </main>
  );
}
