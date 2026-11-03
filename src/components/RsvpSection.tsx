import { useEffect, useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getGuestByToken, respondGuestAction } from "@/app/actions/guests"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon, CheckIcon } from "./icons"

type RsvpSectionProps = {
  onLocation: () => void
  guestToken?: string
  eventDate?: string
  onConfirm?: () => void
  onDecline?: () => void
}

export function RsvpSection({
  onLocation,
  guestToken,
  eventDate,
  onConfirm,
  onDecline,
}: RsvpSectionProps) {
  const [guestName, setGuestName] = useState<string>()
  const [guestStatus, setGuestStatus] = useState<
    "AGUARDANDO" | "CONFIRMADO" | "NAO_CONFIRMADO"
  >("AGUARDANDO")
  const [changingResponse, setChangingResponse] = useState(false)
  const [pending, startTransition] = useTransition()
  const isExpired = eventDate ? new Date(eventDate) < new Date() : false

  useEffect(() => {
    if (!guestToken) return
    startTransition(async () => {
      const guest = await getGuestByToken(guestToken)
      if (guest) {
        setGuestName(guest.nome)
        setGuestStatus(guest.status)
      }
    })
  }, [guestToken])

  const runAction = (status: "CONFIRMADO" | "NAO_CONFIRMADO", action?: () => void) => {
    if (eventDate && new Date(eventDate) < new Date()) {
      return
    }

    if (guestToken) {
      startTransition(async () => {
        const result = await respondGuestAction(guestToken, status)
        if (result.ok) {
          setGuestStatus(status)
          setChangingResponse(false)
          toast.success(
            status === "CONFIRMADO"
              ? "Presença confirmada com sucesso."
              : "Resposta registrada.",
          )
        } else if (result.error) {
          toast.error(result.error)
        }
      })
    } else {
      toast.error("Abra o link individual do convite para responder.")
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
        <img className="rsvp-monogram" src="/assets/invite/monogram.png" alt="JB" />
        <p className="mb-[18px] text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--caramel)]">
          {guestName ? `Olá, ${guestName}` : "Sua presença é o melhor presente"}
        </p>
        <h2 className="m-0 font-['Playfair_Display'] text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.04em]">
          Vamos comemorar juntos?
        </h2>
        <p className="mx-auto my-6 mb-8 max-w-[500px] leading-[1.7] text-[rgb(52_64_48_/_67%)]">
          Confirme sua presença para prepararmos cada detalhe dessa festa com muito
          carinho.
        </p>
        {guestStatus !== "AGUARDANDO" && !changingResponse ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-[var(--sage-dark)]">
              {guestStatus === "CONFIRMADO"
                ? "Você confirmou presença."
                : "Você informou que não poderá comparecer."}
            </p>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-[rgb(116_128_104_/_28%)] bg-transparent px-6 text-[0.76rem] tracking-[0.06em] text-[var(--sage-dark)] hover:bg-[var(--cream)]"
              type="button"
              onClick={() => setChangingResponse(true)}
            >
              Mudar resposta
            </Button>
          </div>
        ) : (
          <div className="flex justify-center gap-3 max-[600px]:flex-col">
            <Button
              className="min-h-[54px] rounded-full border-[var(--sage)] bg-[var(--sage)] px-6 text-[0.76rem] tracking-[0.06em] text-[var(--white)] shadow-[0_12px_26px_rgb(79_92_71_/_18%)] hover:bg-[var(--sage-dark)] hover:shadow-[0_16px_32px_rgb(79_92_71_/_24%)] max-[600px]:w-full"
              type="button"
              disabled={isExpired || pending}
              onClick={() => runAction("CONFIRMADO", onConfirm)}
            >
              {pending ? <Loader2 className="animate-spin" /> : <CheckIcon />}
              {pending ? "Enviando..." : "Confirmar presença"}
            </Button>
            <Button
              variant="outline"
              className="min-h-[54px] rounded-full border-[rgb(116_128_104_/_28%)] bg-transparent px-6 text-[0.76rem] tracking-[0.06em] text-[var(--sage-dark)] hover:bg-[var(--cream)] max-[600px]:w-full"
              type="button"
              disabled={isExpired || pending}
              onClick={() => runAction("NAO_CONFIRMADO", onDecline)}
            >
              {pending ? <Loader2 className="animate-spin" /> : null}
              {pending ? "Enviando..." : "Não poderei ir"}
            </Button>
          </div>
        )}
        <small className="mt-[18px] block text-[0.68rem] text-[rgb(52_64_48_/_44%)]">
          {guestToken
            ? "Sua resposta pode ser alterada enquanto o convite estiver aberto."
            : "Abra o link individual do convite para confirmar sua presença."}
        </small>
        <Button
          variant="ghost"
          className="scroll-button mx-auto mt-[26px] h-auto items-center gap-[14px] bg-transparent p-0 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--sage-dark)] hover:bg-transparent hover:text-[var(--sage-dark)]"
          type="button"
          onClick={onLocation}
        >
          <span>Ver localização</span>
          <ArrowDownIcon />
        </Button>
      </div>
    </section>
  )
}
