'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface FlyingItemProps {
  imageUrl: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onComplete: () => void;
}

export function FlyingItem({ imageUrl, startPosition, endPosition, onComplete }: FlyingItemProps) {
  // Calculate a control point for the bezier curve
  // Make it higher than both start and end points for a nice arc
  const controlPoint = {
    x: (startPosition.x + endPosition.x) / 2,
    y: Math.min(startPosition.y, endPosition.y) - 100
  };

  const pathDefinition = `
    M ${startPosition.x} ${startPosition.y}
    Q ${controlPoint.x} ${controlPoint.y} ${endPosition.x} ${endPosition.y}
  `;

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        scale: 1,
        offsetPath: `path('${pathDefinition}')`,
        offsetDistance: "0%"
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [1, 1.2, 0.5],
        offsetDistance: "100%"
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
        times: [0, 0.2, 0.8, 1]
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        zIndex: 100,
        pointerEvents: 'none',
        width: '50px',
        height: '50px',
      }}
    >
      <Image
        src={imageUrl}
        alt="Flying item"
        fill
        className="object-cover rounded-md"
      />
    </motion.div>
  );
}
