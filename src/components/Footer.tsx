import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex-shrink-0 border-t border-zinc-800 mt-8 pt-6 pb-4 px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-zinc-500">
      <span>Created by qbpg</span>
      <span className="text-zinc-700">·</span>
      <a href="mailto:qbpg.sg@outlook.com" translate="no" className="hover:text-zinc-300 transition-colors">qbpg.sg@outlook.com</a>
      <span className="text-zinc-700">·</span>
      <Link href="/legal" className="hover:text-zinc-300 transition-colors underline-offset-2 hover:underline">Legal Notice</Link>
      <span className="text-zinc-700">·</span>
      <Link href="/privacy" className="hover:text-zinc-300 transition-colors underline-offset-2 hover:underline">Privacy Policy</Link>
      <span className="text-zinc-700">·</span>
      <Link href="/terms" className="hover:text-zinc-300 transition-colors underline-offset-2 hover:underline">Terms of Service</Link>
      <span className="text-zinc-700">·</span>
      <Link href="/refund" className="hover:text-zinc-300 transition-colors underline-offset-2 hover:underline">Refund Policy</Link>
    </footer>
  );
}
