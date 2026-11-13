import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type MusicButtonProps = {
  href: string;
  icon: ReactNode;
  label: string;
  className?: string;
};

export function MusicButton({ href, icon, label, className }: MusicButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-center",
        "bg-[#101f27]/90 text-[#aec5cd] hover:bg-[#19333f]",
        "transition-colors border border-[#26404b] focus-visible:outline-[#8bb1bf]",
        "backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center">{icon}</div>
      <span className="text-center text-sm font-medium text-inherit">{label}</span>
    </a>
  );
}
