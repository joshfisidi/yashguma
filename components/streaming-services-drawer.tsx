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
  TidalIcon,
  YouTubeMusicIcon,
} from "@/lib/icons";
import { ChevronUp } from "lucide-react";

const OTHER_SERVICES = [
  { label: "Deezer", href: "https://www.deezer.com", icon: <DeezerIcon className="h-5 w-5 text-white" /> },
  { label: "TIDAL", href: "https://tidal.com", icon: <TidalIcon className="h-5 w-5 text-white" /> },
  { label: "Audius", href: "https://audius.co", icon: <AudiusIcon className="h-5 w-5 text-white" /> },
  { label: "YouTube Music", href: "https://music.youtube.com", icon: <YouTubeMusicIcon className="h-5 w-5" /> },
  { label: "Amazon Music", href: "https://music.amazon.com", icon: <AmazonMusicIcon className="h-5 w-5" /> },
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
          <DrawerTitle>Other streaming services</DrawerTitle>
          <DrawerDescription>More places to listen to Yash Guma.</DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-3 px-4 pb-6 sm:grid-cols-2">
          {OTHER_SERVICES.map((service) => (
            <MusicButton
              key={service.label}
              href={service.href}
              icon={service.icon}
              label={service.label}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
