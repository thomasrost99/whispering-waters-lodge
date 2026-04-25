import { TreePine, Waves, Compass, Flame } from "lucide-react";
import type { ElementType } from "react";

export interface Feature {
  icon: ElementType;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: TreePine,
    title: "100+ Acres of Forest",
    description:
      "Our spacious log cabin sits on over 100 acres of Wisconsin northwoods — your own private corner of nature to explore.",
  },
  {
    icon: Waves,
    title: "Waterfall, Creek & Private Lake",
    description:
      "A babbling creek, a stunning waterfall, and a private lake with a canoe — all right on the property.",
  },
  {
    icon: Compass,
    title: "Trails & Adventures",
    description:
      "Hike the on-property trails, explore the forest, or take a day trip to the Apostle Islands, Duluth, or Bayfield.",
  },
  {
    icon: Flame,
    title: "Cozy Cabin Living",
    description:
      "An open-concept layout with a wood stove, spacious kitchen, and a patio overlooking the forest, creek, and waterfall.",
  },
];
