import { useState, type FormEvent } from "react";
import { MapPin, Mail, ExternalLink, Send, CheckCircle } from "lucide-react";
import PageHero from "../components/ui/PageHero";
import ContactInfoItem from "../components/ui/ContactInfoItem";
import FormField from "../components/ui/FormField";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

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
            {submitted ? (
              <SuccessMessage onReset={() => setSubmitted(false)} />
            ) : (
              <ContactForm onSubmit={handleSubmit} />
            )}
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

          <ContactInfoItem icon={Mail} label="Email">
            <a href="mailto:hello@whisperingwaterslodge.com" className="hover:text-forest-600 transition-colors">
              hello@whisperingwaterslodge.com
            </a>
          </ContactInfoItem>

          <ContactInfoItem icon={ExternalLink} label="Book on Vrbo">
            <a
              href="https://www.vrbo.com/9605561ha"
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
          All reservations are handled through Vrbo. Check availability, see more
          photos, and book your dates there.
        </p>
        <a
          href="https://www.vrbo.com/9605561ha"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 text-white text-sm font-medium rounded-xl hover:bg-forest-700 transition-all"
        >
          Book on Vrbo
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

/* ─── Contact Form ─── */

function ContactForm({ onSubmit }: { onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-earth-100 p-8 sm:p-10 shadow-sm">
      <h2 className="font-heading text-2xl font-bold text-lodge-dark mb-6">Send a Message</h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField id="name" label="Name" placeholder="Your full name" required />
          <FormField id="email" label="Email" type="email" placeholder="you@example.com" required />
        </div>
        <FormField id="subject" label="Subject" placeholder="What's this about?" required />
        <FormField id="message" label="Message" placeholder="Tell us what's on your mind..." multiline required />

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-8 py-3 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      </form>
    </div>
  );
}

/* ─── Success State ─── */

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-earth-100 p-8 sm:p-10 shadow-sm">
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-forest-500 mx-auto mb-4" />
        <h3 className="font-heading text-2xl font-bold text-lodge-dark mb-2">Message Sent!</h3>
        <p className="text-lodge-charcoal/60 mb-6">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
        <button onClick={onReset} className="text-sm text-forest-600 font-medium hover:underline">
          Send another message
        </button>
      </div>
    </div>
  );
}