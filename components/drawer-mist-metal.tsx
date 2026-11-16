"use client";

import { useState } from "react";
import { LiquidMetal } from "@paper-design/shaders-react";
import { motion } from "motion/react";

export default function DrawerMistMetal({ image, active }: { image: string; active: boolean }) {
  const [supported] = useState(() => {
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      if (!context) return false;
      context.getExtension("WEBGL_lose_context")?.loseContext();
      return true;
    } catch {
      return false;
    }
  });

  if (!supported) return null;

  return (
    <motion.div
      data-slot="drawer-mist-metal"
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
    >
      <LiquidMetal
        className="absolute inset-0"
        image={image}
        colorBack="#00000000"
        colorTint="#357f94"
        shape="none"
        repetition={2}
        softness={0.22}
        shiftRed={0}
        shiftBlue={0}
        distortion={0.07}
        contour={0.4}
        angle={70}
        speed={active ? 0.35 : 0}
        scale={1}
        fit="contain"
        minPixelRatio={1.5}
        maxPixelCount={56000}
      />
    </motion.div>
  );
}
