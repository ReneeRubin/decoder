import { SITE_TESTIMONIALS } from "../data/testimonials";

export function Testimonials() {
  return (
    <div className="testimonials" aria-label="Stimmen von Klientinnen">
      <p className="testimonials-heading">Kundenstimmen nach dem Test und vor dem neuen Leben</p>
      {SITE_TESTIMONIALS.map((t, i) => (
        <blockquote key={`${t.name}-${i}`} className="testimonial">
          <p>„{t.quote}“</p>
          <footer>
            — {t.name}, <cite>{t.context}</cite>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
