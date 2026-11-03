import { LocationIcon } from "./icons"

const mapsUrl =
  "https://www.google.com/maps/place/S%C3%ADtio+F%C3%A1brica+dos+Sonhos/@-3.5123903,-39.5679604,18z/data=!4m6!3m5!1s0x7c04f4ca8704a87:0xc1c30f884b40641d!8m2!3d-3.5123665!4d-39.5668421!16s%2Fg%2F11v6szjh06?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D"

export function LocationSection() {
  return (
    <section className="location" id="localizacao">
      <div className="section-shell location-grid">
        <div className="location-copy" data-reveal>
          <p className="eyebrow">Onde a festa acontece</p>
          <h2>Fábrica dos Sonhos</h2>
          <div className="location-address">
            <LocationIcon />
            <div>
              <strong>Rua Sebastião Matias, Picos</strong>
              <span>Itapipoca – CE · 62508-370</span>
            </div>
          </div>
          <p>
            Esperamos você a partir das <strong>17 horas</strong> para celebrar
            esse dia tão especial com a gente.
          </p>
          <a
            className="primary-button map-link"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <LocationIcon />
            Abrir no Google Maps
          </a>
        </div>
        <div className="map-frame" data-reveal>
          <iframe
            title="Mapa da Fábrica dos Sonhos, Picos"
            src="https://www.google.com/maps?q=-3.5123665,-39.5668421&z=17&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
