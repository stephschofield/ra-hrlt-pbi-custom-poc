'use client';

import * as React from "react"
import { motion } from "framer-motion"

interface LiquidMetalWrapperProps {
  dispersion?: number;
  edgeSharpness?: number;
  liquify?: number;
  speed?: number;
  patternScale?: number;
}

export function LiquidMetalWrapper({
  dispersion = 0.03,
  edgeSharpness = 50,
  liquify = 50,
  speed = 1,
  patternScale = 4
}: LiquidMetalWrapperProps) {
  return (
    <motion.div
      className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-lg"
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 3 / speed,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      style={{
        filter: `blur(${dispersion * 10}px) contrast(${edgeSharpness / 10})`,
      }}
    />
  )
}
