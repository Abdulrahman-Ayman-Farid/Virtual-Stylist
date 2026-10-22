import "./About.css";

/**
 * About section of the homepage redesign.
 *
 * Three-column layout: a tall candle image, a portrait image, and the
 * mission copy block.
 */
export default function About() {
  return (
    <section className="about">
      <div className="about__col about__col--candle">
        <img src="/generated/about-candle.jpg" alt="Lit candle on a styled surface" />
      </div>
      <div className="about__col about__col--portrait">
        <img src="/generated/about-portrait.jpg" alt="Portrait of the stylist" />
      </div>
      <div className="about__col about__col--copy">
        <p className="eyebrow about__eyebrow">TRANSFORM YOUR WARDROBE</p>
        <h2 className="section-heading about__heading">
          BRINGING YOUR STYLE TO LIFE WITH LOOKS THAT INSPIRE CONFIDENCE.
        </h2>
        <p className="body-copy">
          My mission is to help you unlock your full potential with personalized
          coaching and styling guidance.
        </p>
      </div>
    </section>
  );
}
