import { CalendarIcon } from "./icons"

export function InvitationSection() {
  return (
    <section className="invitation" id="convite">
      <div className="section-shell invitation-grid">
        <div className="invitation-art reveal-left" data-reveal>
          <span className="stamp-ring" />
          <img
            className="invitation-crest"
            src="/assets/invite/crest.png"
            alt="Brasão João Bernardo"
          />
          <img
            className="mini-bear mini-bear-football"
            src="/assets/invite/bear-football.png"
            alt=""
            aria-hidden="true"
          />
          <img
            className="mini-bear mini-bear-tennis"
            src="/assets/invite/bear-tennis.png"
            alt=""
            aria-hidden="true"
          />
        </div>

        <div className="invitation-copy reveal-right" data-reveal>
          <p className="eyebrow">Forte como um urso</p>
          <h2>Nosso pequeno grande aventureiro vai fazer 1!</h2>
          <p>
            Com o coração cheio de alegria, convidamos você para celebrar o
            primeiro ano do João Bernardo — uma tarde feita de carinho,
            brincadeiras e memórias para guardar para sempre.
          </p>
          <div className="date-card">
            <CalendarIcon />
            <div>
              <small>Reserve esta data</small>
              <strong>29 de novembro de 2026</strong>
              <span>às 17 horas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
