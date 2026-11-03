import { ArrowDownIcon } from "./icons"

type HeroSectionProps = {
  onDiscover: () => void
}

export function HeroSection({ onDiscover }: HeroSectionProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-pattern" aria-hidden="true" />
      <span className="hero-orbit orbit-one" aria-hidden="true" />
      <span className="hero-orbit orbit-two" aria-hidden="true" />
      <img
        className="floating-ball"
        src="/assets/invite/ball.png"
        alt=""
        aria-hidden="true"
      />
      <img
        className="floating-rackets"
        src="/assets/invite/rackets.png"
        alt=""
        aria-hidden="true"
      />

      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">Você é nosso convidado especial</p>
        <h1 id="hero-title" className="sr-only">
          João Bernardo, 1 aninho
        </h1>
        <img
          className="hero-logo"
          src="/assets/invite/logo-lockup.png"
          alt="João Bernardo, 1 aninho"
        />
        <p className="hero-intro">
          Um ano de descobertas, sorrisos e aventuras merece uma celebração
          inesquecível.
        </p>
        <button className="scroll-button" type="button" onClick={onDiscover}>
          <span>Descubra o convite</span>
          <ArrowDownIcon />
        </button>
      </div>

      <div className="hero-art" aria-hidden="true">
        <span className="sunburst" />
        <span className="soft-cloud cloud-one" />
        <span className="soft-cloud cloud-two" />
        <img className="hero-bear" src="/assets/invite/bear-racer.png" alt="" />
        <span className="hero-number">1</span>
        <span className="hero-track" />
      </div>

      <div className="hero-date" aria-label="Data: 29 de novembro de 2026">
        <span>29</span>
        <span className="date-divider" />
        <span>NOV</span>
        <span className="date-divider" />
        <span>2026</span>
      </div>
    </section>
  )
}
