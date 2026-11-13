"use client";

import Image from "next/image";
import { useEffect, useState, useRef, type MouseEvent, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkewedCardProps {
  children?: ReactNode;
  className?: string;
  imageSrc?: string;
}

export function SkewedCard({ children, className, imageSrc }: SkewedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const layer = scrollRef.current;
    if (!layer) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastScroll = window.scrollY;
    let settleTimer = 0;

    const reset = () => layer.style.removeProperty("transform");
    const handleScroll = () => {
      const scroll = Math.max(0, window.scrollY);
      const delta = scroll - lastScroll;
      lastScroll = scroll;
      if (reducedMotion.matches || delta === 0) return;

      const tilt = Math.max(-11, Math.min(11, delta * 1.35));
      layer.style.transform = `rotateX(${tilt}deg) rotateY(${tilt * -0.4}deg) skewY(${tilt * 0.16}deg)`;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(reset, 140);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    reducedMotion.addEventListener("change", reset);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      reducedMotion.removeEventListener("change", reset);
      window.clearTimeout(settleTimer);
    };
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || typeof window === "undefined" || window.innerWidth < 768) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * -8;
    const rotateY = (mouseX / (rect.width / 2)) * 8;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) setIsHovered(true);
  };

  const [settledImage, setSettledImage] = useState<string>();
  const imagePending = settledImage !== imageSrc;
  const hasContent = children !== undefined && children !== null;

  return (
    <div
      ref={cardRef}
      className="w-full"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div ref={scrollRef} className="transform-3d transition-transform duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none">
        <Card
          className={cn(
            "relative overflow-hidden rounded-[28px] border-none bg-transparent p-0 shadow-none transition-all duration-200 ease-out motion-reduce:transform-none!",
            isHovered && "shadow-xl shadow-black/25",
            className,
          )}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.01 : 1})`,
            transformStyle: "preserve-3d",
          }}
        >
          {imageSrc ? (
            <div className="relative aspect-[4/5] w-full bg-[#0d1e27]">
              {imagePending && <Skeleton aria-hidden className="portrait-skeleton absolute inset-0 rounded-[28px]" />}
              <Image
                key={imageSrc}
                loading="lazy"
                onLoad={() => setSettledImage(imageSrc)}
                onError={() => setSettledImage(imageSrc)}
                src={imageSrc}
                alt="Yash Guma visual"
                width={900}
                height={1125}
                sizes="(max-width: 639px) 15rem, 19rem"
                className={cn(
                  "relative h-full w-full rounded-[28px] object-cover object-center text-[#aec5cd] transition-opacity duration-700 ease-out motion-reduce:transition-none",
                  imagePending ? "opacity-0" : "opacity-100",
                )}
                unoptimized
              />
            </div>
          ) : null}

          {hasContent ? (
            <div
              className="absolute inset-0 p-6"
              style={{ transform: "translateZ(24px)" }}
            >
              {children}
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
