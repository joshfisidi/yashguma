"use client";

import { MusicButton } from "@/components/music-button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800/80 bg-neutral-900/85 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800/90 backdrop-blur-sm"
        >
          Other
          <ChevronUp className="h-4 w-4" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Stream & social</DrawerTitle>
          <DrawerDescription>Choose a service, or a place to follow Yash Guma.</DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 px-4 pb-6 sm:grid-cols-2">
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">Stream</h3>
            <div className="grid gap-2">
              {STREAM_SERVICES.map((service) => (
                <MusicButton
                  key={service.label}
                  href={service.href}
                  icon={service.icon}
                  label={service.label}
                />
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">Social</h3>
            <div className="grid gap-2">
              {SOCIAL_SERVICES.map((service) => (
                <MusicButton
                  key={service.label}
                  href={service.href}
                  icon={service.icon}
                  label={service.label}
                />
              ))}
            </div>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
