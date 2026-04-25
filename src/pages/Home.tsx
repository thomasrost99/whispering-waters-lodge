import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import waterfallVideo from "../assets/waterfall_background.webm";
import { features } from "../data/features";
import SectionHeader from "../components/ui/SectionHeader";
import IconCard from "../components/ui/IconCard";
import WaveDivider from "../components/ui/WaveDivider";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}

/* ─── Hero ─── */

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={waterfallVideo} type="video/webm" />
      </video>

      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-gold-light tracking-[0.3em] uppercase text-sm font-medium mb-6 drop-shadow-md">
          A Northwoods Retreat · Iron River, WI
        </p>
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6 drop-shadow-lg [text-shadow:_0_2px_30px_rgba(0,0,0,0.5)]">
          Whispering
          <br />
          <span className="text-gold">Waters</span> Lodge
        </h1>
        <p className="text-white/85 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
          A spacious log cabin nestled on over 100 acres of Wisconsin forest,
          with a waterfall, private lake, and trails right outside your door.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.vrbo.com/9605561ha"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-lodge-dark font-semibold rounded-xl hover:bg-gold-light active:scale-95 transition-all shadow-lg backdrop-blur-sm"
          >
            Book Your Stay
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/about"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/15 backdrop-blur-sm transition-all"
          >
            Explore the Lodge
          </Link>
        </div>
      </div>

      <WaveDivider />
    </section>
  );
}

/* ─── Features Grid ─── */

function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="The Experience" title="What You'll Find Here" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <IconCard key={f.title} icon={f.icon} title={f.title} text={f.description} centered />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Banner ─── */

function CtaSection() {
  return (
    <section className="py-20 bg-earth-50">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-lodge-dark mb-6">
          Ready to Unplug &amp; Unwind?
        </h2>
        <p className="text-lodge-charcoal/60 text-lg mb-8 max-w-2xl mx-auto">
          Whether it's a family gathering, a group getaway, or a peaceful escape
          into the northwoods — Whispering Waters Lodge is ready for you.
        </p>
        <a
          href="https://www.vrbo.com/9605561ha"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-forest-600 text-white font-semibold rounded-xl hover:bg-forest-700 active:scale-95 transition-all shadow-lg"
        >
          Check Availability on Vrbo
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}