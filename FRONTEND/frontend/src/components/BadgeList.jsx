// ============================================================
// FILE: src/components/BadgeList.jsx   (React — new reusable component)
// ============================================================

import React from "react";

// Color map: badgeType → Tailwind classes  [bg, text, border]
const COLOR_MAP = {
  BACKGROUND_CHECKED:     ["bg-blue-50",   "text-blue-700",   "border-blue-200"],
  CERTIFIED_PROFESSIONAL: ["bg-purple-50", "text-purple-700", "border-purple-200"],
  TOP_RATED:              ["bg-amber-50",  "text-amber-700",  "border-amber-200"],
  VETERAN:                ["bg-green-50",  "text-green-700",  "border-green-200"],
  CENTURY:                ["bg-teal-50",   "text-teal-700",   "border-teal-200"],
};

// Tooltip descriptions shown on hover
const TOOLTIP_MAP = {
  BACKGROUND_CHECKED:     "Identity and background verified by QuickServe",
  CERTIFIED_PROFESSIONAL: "Holds a professional certification in this trade",
  TOP_RATED:              "Maintains an average rating of 4.5 or above",
  VETERAN:                "Has 5+ years of hands-on experience",
  CENTURY:                "Completed 100 or more jobs on QuickServe",
};

// size = "sm" (provider cards) | "md" (profile pages)
const BadgeList = ({ badges = [], size = "sm" }) => {
  if (!badges || badges.length === 0) return null;

  const sizeClass = size === "sm"
    ? "text-xs px-2 py-0.5"
    : "text-sm px-3 py-1";

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => {
        const [bg, text, border] = COLOR_MAP[badge.badgeType] || ["bg-gray-50", "text-gray-600", "border-gray-200"];
        const tooltip = TOOLTIP_MAP[badge.badgeType] || "";

        return (
          <span
            key={badge.badgeType}
            title={tooltip}
            className={`inline-flex items-center gap-1 rounded-full border font-medium cursor-default
                        transition-transform hover:scale-105 ${bg} ${text} ${border} ${sizeClass}`}
          >
            <span style={{ fontSize: size === "sm" ? 11 : 13 }}>{badge.icon}</span>
            {badge.label}
          </span>
        );
      })}
    </div>
  );
};

export default BadgeList;