"use client";

import Image from "next/image";
import { useState, useRef, type MouseEvent, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkewedCardProps {
  children?: ReactNode;
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
      <Card
        className={cn(
          "relative overflow-hidden rounded-[28px] border-none bg-transparent p-0 shadow-none transition-all duration-200 ease-out",
          isHovered && "shadow-xl shadow-black/25",
          className,
        )}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.01 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        {imageSrc ? (
          <div className="relative w-full">
            <Image
              src={imageSrc}
              alt="Yash Guma visual"
              width={900}
              height={1125}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 28rem"
              className="h-auto w-full rounded-[28px] object-cover object-center"
              priority
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
  );
}
