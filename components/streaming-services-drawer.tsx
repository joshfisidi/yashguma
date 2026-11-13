"use client";

import { useEffect, useState } from "react";
import { MusicButton } from "@/components/music-button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
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
  { label: "YouTube Music", href: "https://music.youtube.com", icon: <YouTubeMusicIcon className="h-5 w-5" /> },
  { label: "Deezer", href: "https://www.deezer.com", icon: <DeezerIcon className="h-5 w-5 text-white" /> },
  { label: "TIDAL", href: "https://tidal.com", icon: <TidalIcon className="h-5 w-5 text-white" /> },
  { label: "Audius", href: "https://audius.co", icon: <AudiusIcon className="h-5 w-5 text-white" /> },
  { label: "Amazon Music", href: "https://music.amazon.com", icon: <AmazonMusicIcon className="h-5 w-5" /> },
];

const SOCIAL_SERVICES = [
  { label: "Instagram", href: "https://www.instagram.com/yashguma", icon: <InstagramIcon className="h-5 w-5" /> },
  { label: "TikTok", href: "https://www.tiktok.com/@yashguma", icon: <TiktokIcon className="h-5 w-5" /> },
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
    <Drawer open={open} onOpenChange={setOpen} repositionInputs={false} handleOnly>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800/80 bg-neutral-900/85 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800/90 backdrop-blur-sm"
        >
          Other
          <ChevronUp className="h-4 w-4" />
        </button>
      </DrawerTrigger>
      <DrawerContent
        aria-describedby={undefined}
        className="max-h-[85svh] overflow-hidden border-white/10 bg-neutral-950/96 text-white backdrop-blur-xl"
      >
        <DrawerTitle className="sr-only">More streaming services and social links</DrawerTitle>
        <div className="min-h-0 overflow-y-auto overscroll-contain">
          <div className="mx-auto grid max-w-4xl gap-5 px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:grid-cols-2 sm:gap-6 sm:px-6">
            {[
              { title: "Listen", services: STREAM_SERVICES },
              { title: "Social", services: SOCIAL_SERVICES },
            ].map(({ title, services }) => (
              <section key={title} className="min-w-0">
                <h3 className="mb-2.5 text-sm font-medium text-slate-300">{title}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {services.map((service, index) => (
                    <MusicButton
                      key={service.label}
                      href={service.href}
                      icon={service.icon}
                      label={service.label}
                      className={
                        index === 0
                          ? "col-span-2 min-h-20 justify-start rounded-2xl border-[#234553] bg-[#122b35] px-3 hover:bg-[#193844] focus-visible:outline-sky-300"
                          : "min-h-20 flex-col gap-1.5 rounded-2xl border-white/10 bg-[#10191e] px-1.5 hover:bg-[#192b34] focus-visible:outline-sky-300 [&>span]:text-xs"
                      }
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
