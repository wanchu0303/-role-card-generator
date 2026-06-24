"use client";

import { useEffect, useState } from "react";

/* ─── 像素小厨师 SVG ─── */
function PixelChef({ isWorking }: { isWorking: boolean }) {
  return (
    <div className="pixel-chef-wrapper">
      <div className={`pixel-chef ${isWorking ? "working" : ""}`}>
        <svg
          width="48" height="64"
          viewBox="0 0 12 16"
          style={{ imageRendering: "pixelated" }}
        >
          {/* Chef hat */}
          <rect x="3" y="0" width="6" height="1" fill="#FFFBF5" />
          <rect x="2" y="1" width="8" height="3" fill="#FFFBF5" />
          <rect x="3" y="4" width="6" height="1" fill="#e0d0c0" />
          {/* Face */}
          <rect x="3" y="5" width="6" height="4" fill="#FFCBA4" />
          {/* Eyes */}
          <rect x="4" y="6" width="1" height="1" fill="#2C1810" />
          <rect x="7" y="6" width="1" height="1" fill="#2C1810" />
          {/* Blush */}
          <rect x="3" y="8" width="2" height="1" fill="#FFB3A3" />
          <rect x="7" y="8" width="2" height="1" fill="#FFB3A3" />
          {/* Mouth */}
          {isWorking ? (
            <>
              <rect x="5" y="8" width="2" height="1" fill="#C85A2A" />
              <rect x="4" y="7" width="1" height="1" fill="#C85A2A" />
              <rect x="7" y="7" width="1" height="1" fill="#C85A2A" />
            </>
          ) : (
            <rect x="5" y="8" width="2" height="1" fill="#A0604A" />
          )}
          {/* Neck */}
          <rect x="4" y="9" width="4" height="1" fill="#FFCBA4" />
          {/* Body / apron */}
          <rect x="2" y="10" width="8" height="5" fill="#FFFBF5" />
          <rect x="4" y="10" width="4" height="5" fill="#f5e6d0" />
          {/* Arms */}
          <rect x="0" y="10" width="2" height="4" fill="#FFCBA4" />
          <rect x="10" y="10" width="2" height="4" fill="#FFCBA4" />
          {/* Spoon */}
          {isWorking && (
            <>
              <rect x="11" y="8" width="1" height="3" fill="#C85A2A" />
              <rect x="10" y="7" width="3" height="2" fill="#E8A44A" />
            </>
          )}
          {/* Legs */}
          <rect x="3" y="15" width="2" height="1" fill="#5B4A3F" />
          <rect x="7" y="15" width="2" height="1" fill="#5B4A3F" />
        </svg>
      </div>
      <span className="chef-label">
        {isWorking ? "烹饪中..." : "小厨师"}
      </span>
    </div>
  );
}

/* ─── 传送带动画 ─── */
export function KitchenAnimation({
  isGenerating,
  characterName,
  onComplete,
}: {
  isGenerating: boolean;
  characterName?: string;
  onComplete?: () => void;
}) {
  const [showCard, setShowCard] = useState(false);
  const [cardPhase, setCardPhase] = useState<"start" | "mid" | "end" | "done">("start");

  useEffect(() => {
    if (isGenerating) {
      setShowCard(true);
      setCardPhase("start");

      const t1 = setTimeout(() => setCardPhase("mid"), 700);
      const t2 = setTimeout(() => setCardPhase("end"), 1400);
      const t3 = setTimeout(() => {
        setCardPhase("done");
        setShowCard(false);
        onComplete?.();
      }, 2000);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      setShowCard(false);
      setCardPhase("start");
    }
  }, [isGenerating]);

  const cardClass = showCard ? `belt-card belt-card--${cardPhase}` : "belt-card";

  return (
    <div className="kitchen-panel">
      {/* Header */}
      <div className="kitchen-header">
        <span className="kitchen-header-icon">👨‍🍳</span>
        <span className="kitchen-header-title">出餐口传送带</span>
        <span className="kitchen-header-status">
          {isGenerating ? "厨师正在烹饪..." : "等待出餐"}
        </span>
      </div>

      {/* Belt area */}
      <div className="kitchen-belt-area">
        {/* Chef */}
        <div className="kitchen-chef-spot">
          <PixelChef isWorking={isGenerating} />
        </div>

        {/* Belt */}
        <div className="kitchen-belt">
          <div className={`kitchen-belt-strip ${isGenerating ? "moving" : ""}`}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="belt-segment" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`dup-${i}`} className="belt-segment" />
            ))}
          </div>
          <div className="belt-sheen" />

          {/* Card on belt */}
          {showCard && (
            <div className={cardClass}>
              🍳 {characterName || "角色卡"}
            </div>
          )}
        </div>

        {/* Serving window */}
        <div className="kitchen-window">
          <span className="kitchen-window-icon">
            {cardPhase === "done" ? "🍽️" : isGenerating ? "⏳" : "🍽️"}
          </span>
        </div>
      </div>
    </div>
  );
}
