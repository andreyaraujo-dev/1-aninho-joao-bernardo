import { GiftIcon } from "./icons"

const gifts = [
  ["shirt", "Vestuário", "Roupa tamanho 1 ano", "01"],
  ["moon", "Hora de dormir", "Pijama 18 a 24 meses", "02"],
  ["shoe", "Primeiros passos", "Sapato tamanho 20–21", "03"],
  ["blocks", "Aprender brincando", "Brinquedos educativos", "04"],
] as const

export function GiftsSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--sage)] py-[clamp(100px,12vw,160px)] text-[var(--white)]">
      <div className="mx-auto w-[min(1180px,calc(100%-48px))] relative grid grid-cols-[0.8fr_1.2fr] items-center gap-[clamp(60px,9vw,140px)] max-[900px]:grid-cols-1 max-[900px]:gap-[70px] max-[900px]:text-center max-[600px]:w-[min(calc(100%-32px),1180px)]">
        <div className="relative" data-reveal>
          <p className="mb-[18px] text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--caramel)]">
            Para quem quiser presentear
          </p>
          <h2 className="m-0 font-['Playfair_Display'] text-[clamp(2.8rem,5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            Algumas ideias para o João Bernardo
          </h2>
          <p className="mt-[26px] max-w-[480px] leading-[1.75] text-[rgb(255_254_250_/_68%)] max-[900px]:mx-auto">
            Sua presença já é o nosso maior presente. Mas, se quiser trazer um mimo,
            separamos algumas sugestões.
          </p>
          <img
            className="mt-7 mb-[-60px] ml-auto w-[150px] rotate-[5deg] drop-shadow-[0_18px_18px_rgb(44_54_41_/_24%)]"
            src="/assets/invite/bear-tennis.png"
            alt=""
            aria-hidden="true"
          />
        </div>

        <div className="gift-list grid gap-3">
          {gifts.map(([type, label, title, number]) => (
            <article
              className="grid min-h-[118px] grid-cols-[auto_1fr_auto] items-center gap-[22px] rounded-[20px] border border-[rgb(255_254_250_/_15%)] bg-[rgb(255_255_255_/_6%)] px-[26px] py-5 transition-[background,transform] duration-300 hover:translate-x-2 hover:bg-[rgb(255_255_255_/_10%)] max-[600px]:min-h-[104px] max-[600px]:gap-[14px] max-[600px]:px-4 max-[600px]:text-left"
              data-reveal
              key={number}
            >
              <span className="grid h-[68px] w-[68px] place-items-center rounded-full bg-[var(--sage-soft)] text-[var(--sage-dark)] max-[600px]:h-14 max-[600px]:w-14">
                <GiftIcon type={type} />
              </span>
              <div className="min-w-0">
                <small className="text-[0.64rem] font-semibold uppercase tracking-[0.15em] text-[var(--caramel)]">
                  {label}
                </small>
                <h3 className="m-0 mt-[5px] font-['Playfair_Display'] text-[clamp(1.25rem,2vw,1.65rem)] font-medium">
                  {title}
                </h3>
              </div>
              <span className="text-[0.68rem] font-semibold tracking-[0.12em] text-[rgb(255_254_250_/_35%)] max-[600px]:hidden">
                {number}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
