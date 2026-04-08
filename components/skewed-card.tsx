"use client";

import Image from "next/image";
import { useState, useRef, type MouseEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkewedCardProps {
  children: React.ReactNode;
  className?: string;
  imageSrc?: string;
}

export function SkewedCard({ children, className, imageSrc }: SkewedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || typeof window === "undefined" || window.innerWidth < 768) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * -10;
    const rotateY = (mouseX / (rect.width / 2)) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      className="w-full"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <Card
        className={cn(
          "relative overflow-hidden rounded-[28px] border-border/50 bg-card/85 backdrop-blur-xl transition-all duration-200 ease-out",
          "shadow-2xl shadow-primary/10",
          isHovered && "shadow-primary/20",
          className,
        )}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.01 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${50 + rotation.y * 2}% ${50 + rotation.x * 2}%, rgba(79, 209, 197, 0.15), transparent 50%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {imageSrc ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-border/40">
            <Image
              src={imageSrc}
              alt="Yash Guma visual"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 28rem"
              className="object-cover object-center"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>
        ) : null}

        <CardContent className="relative p-5 sm:p-6 md:p-8" style={{ transform: "translateZ(24px)" }}>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
