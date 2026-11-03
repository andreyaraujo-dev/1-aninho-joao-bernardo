import { GiftIcon } from "./icons"

const gifts = [
  ["shirt", "Vestuário", "Roupa tamanho 1 ano", "01"],
  ["moon", "Hora de dormir", "Pijama 18 a 24 meses", "02"],
  ["shoe", "Primeiros passos", "Sapato tamanho 20–21", "03"],
  ["blocks", "Aprender brincando", "Brinquedos educativos", "04"],
] as const

export function GiftsSection() {
  return (
    <section className="gifts">
      <div className="section-shell gifts-layout">
        <div className="gifts-intro" data-reveal>
          <p className="eyebrow">Para quem quiser presentear</p>
          <h2>Algumas ideias para o João</h2>
          <p>
            Sua presença já é o nosso maior presente. Mas, se quiser trazer um
            mimo, separamos algumas sugestões.
          </p>
          <img src="/assets/invite/bear-tennis.png" alt="" aria-hidden="true" />
        </div>

        <div className="gift-list">
          {gifts.map(([type, label, title, number]) => (
            <article className="gift-item" data-reveal key={number}>
              <span className="gift-icon">
                <GiftIcon type={type} />
              </span>
              <div>
                <small>{label}</small>
                <h3>{title}</h3>
              </div>
              <span className="gift-number">{number}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
