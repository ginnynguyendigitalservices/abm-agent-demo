"use client";

import { useState } from "react";

export function AvatarChip({
  size = 32,
  src = "/ginny.png",
  alt = "Ginny Nguyen",
}: {
  size?: number;
  src?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="shrink-0 rounded-full gradient-hero flex items-center justify-center text-[#0a0b14] font-semibold"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        aria-label={alt}
      >
        GN
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full object-cover border border-border"
      style={{ width: size, height: size }}
    />
  );
}
