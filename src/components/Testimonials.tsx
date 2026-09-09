import { TESTIMONIALS } from "../data/testimonials";

export function Testimonials() {
  return (
    <div className="testimonials" aria-label="Stimmen von Klientinnen">
      {TESTIMONIALS.map((t) => (
        <blockquote key={t.name} className="testimonial">
          <p>„{t.quote}“</p>
          <footer>
            — {t.name}, <cite>{t.context}</cite>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
