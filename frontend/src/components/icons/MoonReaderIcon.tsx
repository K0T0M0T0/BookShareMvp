import * as React from "react";

export type MoonReaderIconProps = {
  /** Pixel size for both width & height */
  size?: number;
  /** Stroke color; defaults to current text color */
  color?: string;
  /** SVG stroke width */
  strokeWidth?: number;
  /** Optional className to style from CSS */
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
};

/**
 * MoonReaderIcon – a whimsical stick-figure reading on a crescent moon.
 * Inspired by the DreamWorks vibe, but fully original artwork.
 *
 * Usage:
 *   <MoonReaderIcon size={64} color="#fff" />
 */
export default function MoonReaderIcon({
  size = 64,
  color = "currentColor",
  strokeWidth = 2,
  className,
  ariaLabel = "Stick figure reading a book on a crescent moon",
}: MoonReaderIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={ariaLabel}
      className={className}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/**
       * Background stars (subtle, thin)
       */}
      <g opacity="0.9">
        <path d="M8 10h0" />
        <path d="M56 12h0" />
        <path d="M50 50h0" />
        <path d="M14 52h0" />
        <path d="M38 8h0" />
        <path d="M22 40h0" />
      </g>

      {/**
       * Crescent moon: draw a big circle arc and subtractive inner arc via stroke-only path.
       */}
      <path
        d="M44 8c-5.8 2.8-10 8.7-10 15.5C34 33.6 42.4 42 52.5 42c1.9 0 3.8-.3 5.5-1-3.2 7.1-10.3 12-18.5 12C27.3 53 17 42.7 17 30.5 17 19.4 25 10.2 35.5 8.3 38 7.8 41 7.6 44 8z"
        fill="none"
      />

      {/**
       * Ground line on moon to suggest surface
       */}
      <path d="M34 36c5.5 1.5 11.5 1.5 17 0" opacity="0.5" />

      {/**
       * Stick figure sitting on the moon's inner curve
       */}
      {/* Head */}
      <circle cx="33" cy="25" r="3" />
      {/* Spine */}
      <path d="M33 28.5l0 6" />
      {/* Seated thigh on moon */}
      <path d="M33 34.5c2 .2 4 .2 6 0" />
      {/* Shin dangling slightly */}
      <path d="M39 34.5l-2.5 4" />
      {/* Back/arm supporting book */}
      <path d="M33 30.5l-3 3" />

      {/**
       * Book in hands (small rectangle), plus hands
       */}
      <rect x="28.4" y="30.2" width="4.6" height="3.6" rx="0.6" />
      {/* Hand lines to book */}
      <path d="M30 33.8l0 2.2" />
      <path d="M31.4 33.8l0 2" />

      {/**
       * Fishing-pole-like wand becomes a bookmark ribbon to evoke DreamWorks
       */}
      <path d="M36.8 22.2c3.2-2.2 7.6-3.3 12.6-3.1" opacity="0.6" />
      <path d="M49.4 19.2c0 1.8-1.1 3.4-2.6 4.2" opacity="0.6" />

      {/**
       * A small cloud/nebula wisp behind the moon for depth (stroke-only)
       */}
      <path d="M11 26c2-2 5.2-2.4 7.6-.8 2-2.2 5.8-2.3 8-.1" opacity="0.35" />

      {/**
       * Optional sparkle (four-point star)
       */}
      <g opacity="0.9">
        <path d="M24 14l0 3" />
        <path d="M22.5 15.5l3 0" />
      </g>
    </svg>
  );
}
