import { Heart, Leaf, Users, Star } from "lucide-react";
import type { ElementType } from "react";

export interface Value {
  icon: ElementType;
  title: string;
  text: string;
}

export const values: Value[] = [
  {
    icon: Heart,
    title: "Family-Owned & Personal",
    text: "This isn't a hotel — it's our family's cabin, and we treat every guest the way we'd want to be treated.",
  },
  {
    icon: Leaf,
    title: "Surrounded by Nature",
    text: "Over 100 acres of forest, a private lake, a waterfall, and trails you can explore without leaving the property.",
  },
  {
    icon: Users,
    title: "Room for Everyone",
    text: "Four bedrooms and two bathrooms comfortably sleep up to 9 — perfect for family gatherings or group getaways.",
  },
  {
    icon: Star,
    title: "Loved by Guests",
    text: "Rated a perfect 10/10 on Vrbo with 20 reviews. Guests love the beauty, the cleanliness, and the peace and quiet.",
  },
];

export interface HighlightItem {
  title: string;
  text: string;
}

export const highlights: HighlightItem[] = [
  {
    title: "4 Bedrooms, Sleeps 9",
    text: "Two king beds, one queen bed, and three twin beds across four bedrooms on two levels.",
  },
  {
    title: "Fully Equipped Kitchen",
    text: "Cook meals together in the open-concept kitchen, dining, and living area.",
  },
  {
    title: "On-Property Waterfall & Lake",
    text: "A short walk to your own private lake with a canoe, plus a stunning waterfall along the creek.",
  },
  {
    title: "Hiking Trails",
    text: "Explore the many trails that wind through over 100 acres of forest right on the property.",
  },
  {
    title: "Near Delta Diner & Iron River",
    text: "The famous Delta Diner is just down the road, with shops, wineries, and breweries nearby in Iron River.",
  },
  {
    title: "Day-Trip Adventures",
    text: "Easy drives to Duluth, the Apostle Islands, Bayfield, Ashland, and Chequamegon National Forest.",
  },
];
