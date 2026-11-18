"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import LiquidGlass from "liquid-glass-react";
import { DrawerMist } from "@/components/drawer-mist";
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
  { label: "Deezer", href: "https://www.deezer.com", icon: <DeezerIcon className="h-5 w-5" /> },
  { label: "TIDAL", href: "https://tidal.com", icon: <TidalIcon className="h-5 w-5" /> },
  { label: "Audius", href: "https://audius.co", icon: <AudiusIcon className="h-5 w-5" /> },
  { label: "Amazon Music", href: "https://music.amazon.com", icon: <AmazonMusicIcon className="h-5 w-5" /> },
];

const SOCIAL_SERVICES = [
  { label: "Instagram", href: "https://www.instagram.com/yashguma", icon: <InstagramIcon className="h-5 w-5" /> },
  { label: "TikTok", href: "https://www.tiktok.com/@yashguma", icon: <TiktokIcon className="h-5 w-5" /> },
  { label: "Snapchat", href: "https://www.snapchat.com/add/yashguma", icon: <SnapchatIcon className="h-5 w-5" /> },
  { label: "X", href: "https://x.com/yashguma", icon: <XIcon className="h-5 w-5" /> },
  { label: "Threads", href: "https://www.threads.net/@yashguma", icon: <ThreadsIcon className="h-5 w-5" /> },
];

const stationaryGlass = { x: 0, y: 0 };
const MotionDrawerContent = motion.create(DrawerContent);

export function StreamingServicesDrawer({ open, onOpenChange, mistVisible, onMistVisibilityChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mistVisible: boolean;
  onMistVisibilityChange: (visible: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);
  const sheen = useMotionValue(1);
  const sheenOpacity = useSpring(sheen, { stiffness: 240, damping: 30 });

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <Drawer
      open={open}
      onOpenChange={(nextOpen) => {
        sheen.set(1);
        onOpenChange(nextOpen);
      }}
      onDrag={(_, progress) => {
        if (!reduceMotion) sheen.set(1 - Math.min(1, Math.max(0, progress)) * 0.65);
      }}
      onRelease={() => sheen.set(1)}
      repositionInputs={false}
      handleOnly
    >
      <DrawerTrigger asChild>
        <button
          type="button"
          className="home-fade flex items-center justify-center gap-2 rounded-xl border border-[#26404b] bg-[#101f27]/90 px-4 py-3 text-sm font-medium transition-colors text-[#aec5cd] hover:bg-[#19333f] focus-visible:outline-[#8bb1bf] backdrop-blur-sm"
        >
          Other
          <ChevronUp className="h-4 w-4" />
        </button>
      </DrawerTrigger>
      <MotionDrawerContent
        ref={drawerRef}
        aria-describedby={undefined}
        overlayClassName="bg-black/25"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ type: "tween", duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
        className="border-[#a1cbd5]/30 bg-transparent text-[#d3e8ed] outline-hidden shadow-[0_-16px_64px_#0007,inset_0_1px_0_#c2f0ff33] [--drawer-headroom:6rem] sm:[--drawer-headroom:1.5rem] data-[vaul-drawer-direction=bottom]:max-h-[min(85svh,calc(100svh_-_var(--drawer-figure-height)_-_var(--drawer-headroom)))] data-[vaul-drawer-direction=bottom]:rounded-t-[2rem] [&_[data-vaul-handle]]:z-10 [&_[data-vaul-handle]]:h-1.5 [&_[data-vaul-handle]]:w-14"
      >
        <div aria-hidden="true" data-slot="drawer-glass" className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-[inherit]">
          <LiquidGlass
            className="h-full w-full [&>.glass]:h-full [&>.glass]:w-full"
            style={{ position: "absolute", top: "50%", left: "50%" }}
            padding="0"
            cornerRadius={32}
            displacementScale={24}
            blurAmount={0.18}
            saturation={135}
            aberrationIntensity={0}
            elasticity={0}
            globalMousePos={stationaryGlass}
            mouseOffset={stationaryGlass}
          >
            <span />
          </LiquidGlass>
          <div className="absolute inset-0 bg-[#0b202b]/65" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#a9d8e23d,transparent_60%),linear-gradient(155deg,#7fa9b41c,transparent_48%,#5b9ba21f)]"
            style={{ opacity: sheenOpacity }}
          />
        </div>
        <DrawerTitle className="sr-only">More streaming services and social links</DrawerTitle>
        <div className="relative min-h-0 overflow-y-auto overscroll-contain">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.38, ease: "easeOut" }}
            className="mx-auto grid max-w-4xl gap-5 px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:grid-cols-2 sm:gap-6 sm:px-6"
          >
              {[
                { title: "Listen", services: STREAM_SERVICES },
                { title: "Social", services: SOCIAL_SERVICES },
              ].map(({ title, services }) => (
                <section key={title} className="min-w-0">
                  <h3 className="mb-2.5 text-sm font-medium text-[#9dbcc7]">{title}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {services.map((service, index) => (
                      <MusicButton
                        key={service.label}
                        href={service.href}
                        icon={service.icon}
                        label={service.label}
                        className={
                          index === 0
                            ? "col-span-2 min-h-20 justify-start rounded-2xl border-[#a1cbd5]/25 bg-[#3a6372]/40 px-3 text-[#d3e8ed] hover:bg-[#3a6372]/65 focus-visible:outline-[#8bb1bf]"
                            : "min-h-20 flex-col gap-1.5 rounded-2xl border-[#a1cbd5]/15 bg-[#132b37]/50 px-1.5 text-[#d3e8ed] hover:bg-[#31515f]/65 focus-visible:outline-[#8bb1bf] [&>span]:text-xs"
                        }
                      />
                    ))}
                  </div>
                </section>
              ))}
          </motion.div>
        </div>
      </MotionDrawerContent>
      <DrawerMist
        drawerRef={drawerRef}
        open={open}
        reduceMotion={!!reduceMotion}
        visible={mistVisible}
        onVisibilityChange={onMistVisibilityChange}
      />
    </Drawer>
  );
}
