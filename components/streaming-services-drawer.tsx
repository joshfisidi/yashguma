"use client";

import { useEffect, useState } from "react";
import { MusicButton } from "@/components/music-button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  AmazonMusicIcon,
  AudiusIcon,
  DeezerIcon,
  InstagramIcon,
  TidalIcon,
  ThreadsIcon,
  TiktokIcon,
  SnapchatIcon,
  YouTubeMusicIcon,
  XIcon,
} from "@/lib/icons";
import { ChevronUp } from "lucide-react";

const STREAM_SERVICES = [
  { label: "Deezer", href: "https://www.deezer.com", icon: <DeezerIcon className="h-5 w-5 text-white" /> },
  { label: "TIDAL", href: "https://tidal.com", icon: <TidalIcon className="h-5 w-5 text-white" /> },
  { label: "Audius", href: "https://audius.co", icon: <AudiusIcon className="h-5 w-5 text-white" /> },
  { label: "YouTube Music", href: "https://music.youtube.com", icon: <YouTubeMusicIcon className="h-5 w-5" /> },
  { label: "Amazon Music", href: "https://music.amazon.com", icon: <AmazonMusicIcon className="h-5 w-5" /> },
];

const SOCIAL_SERVICES = [
  { label: "Instagram", href: "https://www.instagram.com/yashguma", icon: <InstagramIcon className="h-5 w-5" /> },
  { label: "Tiktok", href: "https://www.tiktok.com/@yashguma", icon: <TiktokIcon className="h-5 w-5" /> },
  { label: "Snapchat", href: "https://www.snapchat.com/add/yashguma", icon: <SnapchatIcon className="h-5 w-5" /> },
  { label: "X", href: "https://x.com/yashguma", icon: <XIcon className="h-5 w-5" /> },
  { label: "Threads", href: "https://www.threads.net/@yashguma", icon: <ThreadsIcon className="h-5 w-5" /> },
];

export function StreamingServicesDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={setOpen} repositionInputs={false}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800/80 bg-neutral-900/85 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800/90 backdrop-blur-sm"
        >
          Other
          <ChevronUp className="h-4 w-4" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85svh] overflow-hidden border-white/10 bg-neutral-950/96 text-white backdrop-blur-xl">
        <div className="grid max-h-[85svh] grid-cols-1 gap-4 overflow-y-auto px-4 pb-6 pt-6 sm:grid-cols-2">
          <section className="space-y-2">
            <div className="grid gap-2">
              {STREAM_SERVICES.map((service) => (
                <MusicButton
                  key={service.label}
                  href={service.href}
                  icon={service.icon}
                  label={service.label}
                  className="w-full justify-start"
                />
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <div className="grid gap-2">
              {SOCIAL_SERVICES.map((service) => (
                <MusicButton
                  key={service.label}
                  href={service.href}
                  icon={service.icon}
                  label={service.label}
                  className="w-full justify-start"
                />
              ))}
            </div>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
