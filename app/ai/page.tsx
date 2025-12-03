"use client";

import { useRouter } from "next/navigation";
import AIChatInterface from "./AIComponent";

export default function AIPage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 select-none flex justify-center">
      <AIChatInterface onBack={() => router.push("/")} />
    </div>
  );
}
