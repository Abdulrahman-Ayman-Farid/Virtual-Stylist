import "./MissionBanner.css";

/**
 * Full-width mission banner with a background image and centered overlay copy.
 */
export default function MissionBanner() {
  return (
    <section className="mission-banner">
      <img
        className="mission-banner__image"
        src="/generated/mission.jpg"
        alt="Stylist at work"
      />
      <div className="mission-banner__overlay">
        <p className="eyebrow mission-banner__eyebrow">MY MISSION:</p>
        <h2 className="mission-banner__heading">
          TO BREAK BOUNDARIES AND EMPOWER WOMEN TO EMBRACE THEIR TRUE SELVES.
        </h2>
      </div>
    </section>
  );
}
