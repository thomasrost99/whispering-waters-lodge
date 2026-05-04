import { MapPin, ExternalLink } from "lucide-react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import PageHero from "../components/ui/PageHero";
import ContactInfoItem from "../components/ui/ContactInfoItem";

// General area only — exact address provided upon booking
const LODGE_COORDS: [number, number] = [46.498, -91.323];

export default function Contact() {
  return (
    <div>
      <PageHero
        gradient="water"
        eyebrow="Get in Touch"
        title={<>We'd Love to <span className="text-gold-light">Hear from You</span></>}
        subtitle="Have a question about the property, your upcoming stay, or anything else? Reach out and we'll get back to you."
      />

      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          <ContactSidebar />
          <div className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden border border-earth-100 shadow-sm" style={{ height: "480px" }}>
              <MapContainer
                center={LODGE_COORDS}
                zoom={11}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Circle
                  center={LODGE_COORDS}
                  radius={3000}
                  pathOptions={{ color: "#2f613a", fillColor: "#2f613a", fillOpacity: 0.12, weight: 1.5 }}
                />
              </MapContainer>
            </div>
            <p className="text-xs text-lodge-charcoal/40 mt-2 text-center">
              Approximate location shown · Exact address provided upon booking
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Sidebar Info ─── */

function ContactSidebar() {
  return (
    <div className="lg:col-span-2 space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-lodge-dark mb-6">Lodge Info</h2>
        <div className="space-y-5">
          <ContactInfoItem icon={MapPin} label="Location">
            <p>Delta, WI · Near Iron River<br />Bayfield County, Wisconsin</p>
          </ContactInfoItem>

          {/* Email — uncomment when address is ready
          <ContactInfoItem icon={Mail} label="Email">
            <a href="mailto:hello@whisperingwaterslodge.com" className="hover:text-forest-600 transition-colors">
              hello@whisperingwaterslodge.com
            </a>
          </ContactInfoItem>
          */}

          <ContactInfoItem icon={ExternalLink} label="Book on North Country Vacation Rentals">
            <a
              href="https://www.northcountryvacationrentals.net/Whispering-Waters-Lodge/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-forest-600 transition-colors"
            >
              View listing &amp; check availability →
            </a>
          </ContactInfoItem>
        </div>
      </div>

      <div className="bg-forest-50 rounded-2xl p-6 border border-forest-100">
        <h3 className="font-heading text-lg font-semibold text-lodge-dark mb-2">
          Ready to book?
        </h3>
        <p className="text-lodge-charcoal/60 text-sm mb-4">
          All reservations are handled through North Country Vacation Rentals. Check availability, see more
          photos, and book your dates there.
        </p>
        <a
          href="https://www.northcountryvacationrentals.net/Whispering-Waters-Lodge/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 text-white text-sm font-medium rounded-xl hover:bg-forest-700 transition-all"
        >
          Book Now
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}