"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail, FileText, Code2, Layers } from "lucide-react";

interface NavButtonsProps {
  position: "left" | "right";
  className?: string;
}

const leftButtons = [
  { icon: Code2, label: "Projects", href: "#projects" },
  { icon: Layers, label: "Work", href: "#work" },
  { icon: FileText, label: "Resume", href: "#resume" },
];

const rightButtons = [
  { icon: Github, label: "GitHub", href: "https://github.com/yashguma" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/yashguma" },
  { icon: Mail, label: "Contact", href: "mailto:hello@yashguma.com" },
];

export function NavButtons({ position, className }: NavButtonsProps) {
  const buttons = position === "left" ? leftButtons : rightButtons;

  return (
    <div className={cn("grid gap-3", className)}>
      {buttons.map((button) => (
        <Button
          key={button.label}
          variant="outline"
          size="lg"
          className={cn(
            "group relative h-auto min-h-14 w-full justify-start gap-3 overflow-hidden rounded-2xl px-4 py-4 text-left",
            "bg-secondary/50 backdrop-blur-sm border-border/50",
            "hover:bg-primary/10 hover:border-primary/50",
            "transition-all duration-300",
          )}
          asChild
        >
          <a href={button.href} target={button.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            <button.icon className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm text-foreground/80 transition-colors group-hover:text-foreground sm:text-base">
              {button.label}
            </span>
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 transition-transform duration-700 group-hover:translate-x-[100%]" />
          </a>
        </Button>
      ))}
    </div>
  );
}
