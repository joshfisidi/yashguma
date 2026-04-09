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
        "flex items-center gap-3 rounded-xl px-4 py-3",
        "bg-neutral-900/85 hover:bg-neutral-800/90",
        "transition-colors border border-neutral-800/80",
        "backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center">{icon}</div>
      <span className="text-sm font-medium text-white">{label}</span>
    </a>
  );
}
