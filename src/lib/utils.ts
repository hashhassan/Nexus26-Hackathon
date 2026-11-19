import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the Stitch type scale (text-label-sm etc. are font sizes, not colors),
// otherwise cn("text-label-sm", "text-secondary") drops the size.
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-lg",
            "display-md",
            "headline-lg",
            "headline-md",
            "title-md",
            "body-lg",
            "body-md",
            "label-md",
            "label-sm",
          ],
        },
      ],
    },
  },
});

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
