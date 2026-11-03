import { CalendarIcon } from "./icons"

export function InvitationSection() {
  return (
    <section
      className="bg-[var(--paper)] py-[clamp(100px,13vw,190px)] max-[600px]:py-[90px]"
      id="convite"
    >
      <div className="mx-auto w-[min(1180px,calc(100%-48px))] grid grid-cols-[0.9fr_1.1fr] items-center gap-[clamp(60px,9vw,140px)] max-[900px]:grid-cols-1 max-[900px]:gap-[65px] max-[600px]:w-[min(calc(100%-32px),1180px)]">
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

        <div
          className="invitation-copy reveal-right max-[900px]:text-center"
          data-reveal
        >
          <p className="mb-[18px] text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--caramel)]">
            Forte como um urso
          </p>
          <h2 className="m-0 max-w-[680px] font-['Playfair_Display'] text-[clamp(2.5rem,5vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            Nosso pequeno grande aventureiro vai fazer 1!
          </h2>
          <p className="my-[34px] max-w-[590px] text-[1.04rem] leading-[1.8] text-[rgb(52_64_48_/_70%)] max-[900px]:mx-auto max-[600px]:my-[26px] max-[600px]:text-[0.95rem]">
            Com o coração cheio de alegria, convidamos você para celebrar o
            primeiro ano do João Bernardo — uma tarde feita de carinho,
            brincadeiras e memórias para guardar para sempre.
          </p>
          <div className="mx-0 flex w-fit items-center gap-[18px] rounded-2xl border border-[rgb(116_128_104_/_17%)] bg-[var(--white)] px-[22px] py-[17px] text-left shadow-[0_16px_45px_rgb(79_92_71_/_7%)] max-[900px]:mx-auto">
            <CalendarIcon className="w-7 fill-none stroke-[var(--caramel)] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.5]" />
            <div className="grid gap-1">
              <small className="text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-[rgb(52_64_48_/_52%)]">
                Reserve esta data
              </small>
              <strong className="font-['Playfair_Display'] text-[1.15rem] font-medium">
                29 de novembro de 2026
              </strong>
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-[var(--caramel)]">
                às 17 horas
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
