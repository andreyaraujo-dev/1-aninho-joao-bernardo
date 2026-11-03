import { ArrowDownIcon } from "./icons"

type HeroSectionProps = {
  onDiscover: () => void
}

export function HeroSection({ onDiscover }: HeroSectionProps) {
  return (
    <section
      className="hero relative grid min-h-[100svh] overflow-hidden isolate bg-[var(--cream)] max-[900px]:min-h-[920px] max-[600px]:min-h-[860px]"
      aria-labelledby="hero-title"
    >
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

      <div className="hero-copy relative z-[4] flex w-[min(560px,39vw)] flex-col items-start self-center ml-[max(7vw,48px)] max-[900px]:mt-20 max-[900px]:mx-6 max-[900px]:w-[calc(100%-48px)] max-[900px]:items-center max-[900px]:text-center max-[600px]:mt-[60px] max-[600px]:mx-4 max-[600px]:w-[calc(100%-32px)]">
        <p className="hero-eyebrow mb-[18px] text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--caramel)]">
          Você é nosso convidado especial
        </p>
        <h1 id="hero-title" className="sr-only">
          João Bernardo, 1 aninho
        </h1>
        <img
          className="hero-logo"
          src="/assets/invite/logo-lockup.png"
          alt="João Bernardo, 1 aninho"
        />
        <p className="hero-intro my-2 mb-[30px] w-[min(440px,100%)] font-['Playfair_Display'] text-[clamp(1.08rem,1.5vw,1.3rem)] leading-[1.55] text-[rgb(52_64_48_/_76%)] max-[900px]:text-[1.05rem] max-[600px]:mt-0">
          Um ano de descobertas, sorrisos e aventuras merece uma celebração
          inesquecível.
        </p>
        <button
          className="scroll-button inline-flex items-center gap-[14px] border-0 bg-transparent text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--sage-dark)]"
          type="button"
          onClick={onDiscover}
        >
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

      <div
        className="hero-date absolute right-[4vw] bottom-9 z-[4] flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.14em] text-[var(--sage-dark)] max-[900px]:right-6 max-[900px]:bottom-[22px] max-[600px]:right-4 max-[600px]:left-4 max-[600px]:justify-center"
        aria-label="Data: 29 de novembro de 2026"
      >
        <span>29</span>
        <span className="date-divider" />
        <span>NOV</span>
        <span className="date-divider" />
        <span>2026</span>
      </div>
    </section>
  )
}
