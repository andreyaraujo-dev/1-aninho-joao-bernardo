import { LocationIcon } from "./icons"

const mapsUrl =
  "https://www.google.com/maps/place/S%C3%ADtio+F%C3%A1brica+dos+Sonhos/@-3.5123903,-39.5679604,18z/data=!4m6!3m5!1s0x7c04f4ca8704a87:0xc1c30f884b40641d!8m2!3d-3.5123665!4d-39.5668421!16s%2Fg%2F11v6szjh06?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D"

export function LocationSection() {
  return (
    <section
      className="bg-[var(--paper)] py-[clamp(100px,12vw,165px)]"
      id="localizacao"
    >
      <div className="mx-auto w-[min(1180px,calc(100%-48px))] grid grid-cols-[0.75fr_1.25fr] items-center gap-[clamp(50px,8vw,110px)] max-[900px]:grid-cols-1 max-[900px]:gap-[60px] max-[600px]:w-[min(calc(100%-32px),1180px)]">
        <div className="location-copy text-left max-[900px]:text-center" data-reveal>
          <p className="mb-[18px] text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--caramel)]">
            Onde a festa acontece
          </p>
          <h2 className="m-0 max-w-[440px] font-['Playfair_Display'] text-[clamp(2.5rem,5vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.04em] max-[900px]:mx-auto">
            Fábrica dos Sonhos
          </h2>
          <div className="mt-8 flex items-center gap-4 max-[900px]:mx-auto">
            <LocationIcon className="h-12 w-12 rounded-full bg-[var(--sage-soft)] p-3 fill-none stroke-[var(--sage-dark)] stroke-1.5" />
            <div className="grid gap-1">
              <strong className="font-['Playfair_Display'] text-[1.15rem] font-medium">
                Rua Sebastião Matias, Picos
              </strong>
              <span className="text-[0.78rem] text-[rgb(52_64_48_/_55%)]">
                Itapipoca – CE · 62508-370
              </span>
            </div>
          </div>
          <p className="my-7 max-w-[450px] leading-[1.75] text-[rgb(52_64_48_/_68%)] max-[900px]:mx-auto">
            Esperamos você a partir das <strong>17 horas</strong> para celebrar esse dia
            tão especial com a gente.
          </p>
          <a
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-[var(--sage)] bg-[var(--sage)] px-6 py-0 min-h-[54px] text-[0.76rem] font-semibold tracking-[0.06em] text-[var(--white)] no-underline shadow-[0_12px_26px_rgb(79_92_71_/_18%)] transition-[transform,background,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[var(--sage-dark)] max-[900px]:mx-auto"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <LocationIcon className="w-[18px] fill-none stroke-current stroke-[1.7]" />
            Abrir no Google Maps
          </a>
        </div>
        <div
          className="relative min-h-[520px] overflow-hidden rounded-[36px] border-[12px] border-[var(--white)] shadow-[0_30px_70px_rgb(79_92_71_/_15%)] max-[600px]:min-h-[400px] max-[600px]:rounded-3xl max-[600px]:border-[8px]"
          data-reveal
        >
          <iframe
            title="Mapa da Fábrica dos Sonhos, Picos"
            src="https://www.google.com/maps?q=-3.5123665,-39.5668421&z=17&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[520px] w-full border-0 saturate-[0.65] sepia-[0.08] max-[600px]:h-[400px] max-[600px]:min-h-[400px]"
          />
        </div>
      </div>
    </section>
  )
}
