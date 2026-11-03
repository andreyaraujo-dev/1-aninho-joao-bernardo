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
    <section
      className="relative z-[1] grid min-h-[760px] overflow-visible place-items-center bg-[var(--cream)] px-6 py-[100px] max-[600px]:min-h-[720px] max-[600px]:px-4 max-[600px]:pt-[70px] max-[600px]:pb-[120px]"
      id="confirmar-presenca"
    >
      <div className="rsvp-pattern" aria-hidden="true" />
      <img
        className="rsvp-bear"
        src="/assets/invite/bear-racer.png"
        alt=""
        aria-hidden="true"
      />
      <div
        className="relative z-[2] w-[min(680px,100%)] rounded-[36px] border border-[rgb(116_128_104_/_16%)] bg-[rgb(255_254_250_/_90%)] p-[clamp(45px,7vw,80px)] text-center shadow-[0_30px_80px_rgb(79_92_71_/_14%)] backdrop-blur-xl max-[600px]:rounded-[26px]"
        data-reveal
      >
        <img
          className="rsvp-monogram"
          src="/assets/invite/monogram.png"
          alt="JB"
        />
        <p className="mb-[18px] text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--caramel)]">
          Sua presença é o melhor presente
        </p>
        <h2 className="m-0 font-['Playfair_Display'] text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.04em]">
          Vamos comemorar juntos?
        </h2>
        <p className="mx-auto my-6 mb-8 max-w-[500px] leading-[1.7] text-[rgb(52_64_48_/_67%)]">
          Confirme sua presença para prepararmos cada detalhe dessa festa com
          muito carinho.
        </p>
        <div className="flex justify-center gap-3 max-[600px]:flex-col">
          <button
            className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-[var(--sage)] bg-[var(--sage)] px-6 text-[0.76rem] font-semibold tracking-[0.06em] text-[var(--white)] shadow-[0_12px_26px_rgb(79_92_71_/_18%)] transition-[transform,background,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[var(--sage-dark)] hover:shadow-[0_16px_32px_rgb(79_92_71_/_24%)] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none max-[600px]:w-full"
            type="button"
            disabled={isExpired}
            onClick={() => runAction(onConfirm)}
          >
            <CheckIcon />
            Confirmar presença
          </button>
          <button
            className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-[rgb(116_128_104_/_28%)] bg-transparent px-6 text-[0.76rem] font-semibold tracking-[0.06em] text-[var(--sage-dark)] transition-[transform,background,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[var(--cream)] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none max-[600px]:w-full"
            type="button"
            disabled={isExpired}
            onClick={() => runAction(onDecline)}
          >
            Não poderei ir
          </button>
        </div>
        <small className="mt-[18px] block text-[0.68rem] text-[rgb(52_64_48_/_44%)]">
          Os botões serão conectados ao sistema de confirmação.
        </small>
        <button
          className="scroll-button mx-auto mt-[26px] inline-flex items-center gap-[14px] border-0 bg-transparent text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--sage-dark)]"
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
