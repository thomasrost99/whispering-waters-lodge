import { Link } from "react-router-dom";
import PageHero from "../components/ui/PageHero";

export default function NotFound() {
  return (
    <div>
      <PageHero
        gradient="water"
        eyebrow="Page Not Found"
        title={<>Off the <span className="text-gold-light">Trail</span></>}
        subtitle="We couldn't find that page."
      />

      <section className="py-16 sm:py-24 px-4 text-center">
        <Link to="/" className="underline underline-offset-2 text-earth-600 hover:text-earth-800">
          Back to the home page
        </Link>
      </section>
    </div>
  );
}
