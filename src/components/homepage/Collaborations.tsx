import "./Collaborations.css";

/**
 * Collaborations strip — publication logos displayed on a cream band.
 */
export default function Collaborations() {
  return (
    <section className="collaborations">
      <span className="eyebrow collaborations__label">COLLABORATIONS:</span>
      <span className="collaborations__logo collaborations__logo--goop">goop</span>
      <span className="collaborations__logo collaborations__logo--glamour">GLAMOUR</span>
      <span className="collaborations__logo collaborations__logo--popsugar">POPSUGAR</span>
      <span className="collaborations__logo collaborations__logo--forbes">Forbes</span>
      <span className="collaborations__logo collaborations__logo--elle">ELLE</span>
    </section>
  );
}
