import { ArrowRight } from "lucide-react";
import lodgeFrontImg from "../assets/lodge_front.avif";
import { values, highlights } from "../data/about";
import PageHero from "../components/ui/PageHero";
import ParallaxForest from "../components/ParallaxForest";

export default function About() {
  return (
    <div>
      <PageHero
        gradient="forest"
        eyebrow="About the Lodge"
        title={<>Your Northwoods <span className="text-gold">Getaway</span></>}
        subtitle="A family-owned log cabin on over 100 acres of Wisconsin forest, with a waterfall, private lake, and trails right on the property."
      />
      <StorySection />
      <ParallaxForest>
        <ValuesSection />
        <HighlightsSection />
      </ParallaxForest>
      <BookingCta />
    </div>
  );
}

/* ─── Story + Lodge Photo ─── */

function StorySection() {
  return (
    <section className="py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={lodgeFrontImg}
              alt="Whispering Waters Lodge exterior"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-xl bg-gold/10 border border-gold/20 -z-10" />
        </div>

        <div>
          <p className="text-forest-600 tracking-widest uppercase text-sm font-medium mb-3">
            Delta, WI · Near Iron River
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-lodge-dark mb-6">
            A Place to Refresh, Reset &amp; Renew
          </h2>
          <div className="space-y-4 text-lodge-charcoal/70 leading-relaxed">
            <p>
              Whispering Waters Lodge is our family's spacious log cabin, tucked
              away on over 100 acres of forest in Wisconsin's beautiful northwoods.
              We opened it up as a vacation rental because a place this special
              deserves to be shared.
            </p>
            <p>
              The cabin sits alongside a babbling creek with a stunning waterfall,
              and a short walk takes you to your own private lake with a canoe.
              The property is laced with trails for hiking and exploring, with
              over 100 acres of forest to wander through.
            </p>
            <p>
              Inside, you'll find four bedrooms, two bathrooms, a fully equipped
              kitchen, and an open-concept living area with a cozy wood stove.
              Glass doors and a patio give you panoramic views of the forest,
              creek, and waterfall. It's the kind of place where you sit down,
              take a deep breath, and feel the world slow down.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Values Grid ─── */

function ValuesSection() {
  return (
    <section className="py-20 sm:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold/70 tracking-[0.25em] uppercase text-xs sm:text-sm font-medium mb-3">Why Guests Love It</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cream">What Sets Us Apart</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="bg-black/35 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center">
                <div className="w-14 h-14 rounded-xl bg-gold/20 text-gold flex items-center justify-center mb-5 mx-auto">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-cream mb-2">{v.title}</h3>
                <p className="text-earth-200/70 leading-relaxed text-sm">{v.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Property Highlights ─── */

function HighlightsSection() {
  return (
    <section className="py-10 sm:py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold/70 tracking-[0.25em] uppercase text-xs sm:text-sm font-medium mb-3">The Details</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cream">What's Included</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((h) => (
            <div key={h.title} className="bg-black/35 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <h3 className="font-heading text-lg font-semibold text-cream mb-2">{h.title}</h3>
              <p className="text-earth-200/70 text-sm leading-relaxed">{h.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Booking CTA ─── */

function BookingCta() {
  return (
    <section className="py-20 bg-forest-800 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-4">
          Ready to Book Your Stay?
        </h2>
        <p className="text-earth-200 text-lg mb-8 max-w-2xl mx-auto">
          Check availability, see more photos, and reserve your dates on Vrbo.
        </p>
        <a
          href="https://www.vrbo.com/9605561ha"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-lodge-dark font-semibold rounded-xl hover:bg-gold-light active:scale-95 transition-all shadow-lg"
        >
          Book on Vrbo
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}