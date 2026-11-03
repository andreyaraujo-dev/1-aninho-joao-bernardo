import { isBirthdayPast } from "../config/event"
import { ArrowDownIcon, CheckIcon } from "./icons"

type RsvpSectionProps = {
  onLocation: () => void
  onConfirm?: () => void
  onDecline?: () => void
}

export function RsvpSection({
  onLocation,
  onConfirm,
  onDecline,
}: RsvpSectionProps) {
  const isExpired = isBirthdayPast()
  const runAction = (action?: () => void) => {
    if (isBirthdayPast()) {
      return
    }

    action?.()
  }

  return (
    <section className="rsvp" id="confirmar-presenca">
      <div className="rsvp-pattern" aria-hidden="true" />
      <img
        className="rsvp-bear"
        src="/assets/invite/bear-racer.png"
        alt=""
        aria-hidden="true"
      />
      <div className="rsvp-card" data-reveal>
        <img
          className="rsvp-monogram"
          src="/assets/invite/monogram.png"
          alt="JB"
        />
        <p className="eyebrow">Sua presença é o melhor presente</p>
        <h2>Vamos comemorar juntos?</h2>
        <p>
          Confirme sua presença para prepararmos cada detalhe dessa festa com
          muito carinho.
        </p>
        <div className="rsvp-actions">
          <button
            className="primary-button"
            type="button"
            disabled={isExpired}
            onClick={() => runAction(onConfirm)}
          >
            <CheckIcon />
            Confirmar presença
          </button>
          <button
            className="secondary-button"
            type="button"
            disabled={isExpired}
            onClick={() => runAction(onDecline)}
          >
            Não poderei ir
          </button>
        </div>
        <small>Os botões serão conectados ao sistema de confirmação.</small>
        <button
          className="scroll-button location-scroll-button"
          type="button"
          onClick={onLocation}
        >
          <span>Ver localização</span>
          <ArrowDownIcon />
        </button>
      </div>
    </section>
  )
}
