"use client";

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Skeleton } from "@/components/ui/skeleton";
import "swiper/css";
import styles from "./portrait-carousel.module.css";

export function PortraitCarousel({ imageSrc }: { imageSrc: string }) {
  const [settledImage, setSettledImage] = useState<string>();
  const imagePending = settledImage !== imageSrc;

  return (
    <Swiper
      aria-label="Portrait carousel"
      className={`portrait-carousel relative left-1/2 w-screen -translate-x-1/2 ${styles.carousel}`}
      centeredSlides
      slidesPerView="auto"
      spaceBetween={16}
      loop
      grabCursor
      touchStartPreventDefault={false}
      onBeforeInit={(swiper) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) swiper.params.speed = 0;
      }}
    >
      {Array.from({ length: 7 }, (_, index) => (
        <SwiperSlide key={index}>
          {({ isActive }) => (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#0d1e27]">
              {imagePending && <Skeleton aria-hidden className="portrait-skeleton absolute inset-0" />}
              <Image
                src={imageSrc}
                alt={isActive ? "Yash Guma visual" : ""}
                width={900}
                height={1125}
                sizes="(max-width: 639px) 15rem, 19rem"
                loading="lazy"
                draggable={false}
                unoptimized
                onLoad={() => setSettledImage(imageSrc)}
                onError={() => setSettledImage(imageSrc)}
                className={`relative h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${imagePending ? "opacity-0" : "opacity-100"}`}
              />
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
