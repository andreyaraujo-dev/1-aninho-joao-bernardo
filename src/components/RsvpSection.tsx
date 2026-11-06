import { useEffect, useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  getInviteByToken,
  respondFamilyAction,
  respondGuestAction,
} from "@/app/actions/guests"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowDownIcon, CheckIcon } from "./icons"

type GuestStatus = "AGUARDANDO" | "CONFIRMADO" | "NAO_CONFIRMADO"

type InviteData =
  | { type: "guest"; name: string; status: GuestStatus }
  | {
      type: "family"
      familyName: string
      members: {
        id: string
        nome: string
        tipo: string
        status: GuestStatus
        isRepresentante: boolean
      }[]
    }
  | null

type RsvpSectionProps = {
  onLocation: () => void
  guestToken?: string
  eventDate?: string
  onConfirm?: () => void
  onDecline?: () => void
}

function tipoLabel(tipo: string) {
  if (tipo === "IDOSO") return "Idoso"
  if (tipo === "CRIANCA") return "Criança"
  return "Adulto"
}

export function RsvpSection({
  onLocation,
  guestToken,
  eventDate,
  onConfirm,
  onDecline,
}: RsvpSectionProps) {
  const [invite, setInvite] = useState<InviteData>(null)
  const [changingResponse, setChangingResponse] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [familyModalOpen, setFamilyModalOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const isExpired = eventDate ? new Date(eventDate) < new Date() : false

  useEffect(() => {
    if (!guestToken) return
    startTransition(async () => {
      try {
        const result = await getInviteByToken(guestToken)
        if (!result) return

        if (result.type === "guest") {
          setInvite({
            type: "guest",
            name: result.guest.nome,
            status: result.guest.status as GuestStatus,
          })
        } else {
          const { family } = result
          setInvite({
            type: "family",
            familyName: family.nome,
            members: family.members.map((m) => ({
              id: m.id,
              nome: m.nome,
              tipo: m.tipo,
              status: m.status as GuestStatus,
              isRepresentante: m.isRepresentante,
            })),
          })
          const prevConfirmed = new Set(
            family.members.filter((m) => m.status === "CONFIRMADO").map((m) => m.id),
          )
          const rep = family.members.find((m) => m.isRepresentante)
          if (rep) prevConfirmed.add(rep.id)
          setSelectedIds(prevConfirmed)
        }
      } catch {
        // invite stays null — no member-specific UI shown
      }
    })
  }, [guestToken])

  function toggleMember(id: string, isRepresentante: boolean) {
    if (isRepresentante) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const guestStatus =
    invite?.type === "guest" ? invite.status : ("AGUARDANDO" as GuestStatus)
  const familyAlreadyResponded =
    invite?.type === "family" && invite.members.some((m) => m.status !== "AGUARDANDO")

  function runGuestAction(
    status: "CONFIRMADO" | "NAO_CONFIRMADO",
    action?: () => void,
  ) {
    if (isExpired || !guestToken) return
    startTransition(async () => {
      const result = await respondGuestAction(guestToken, status)
      if (result.ok) {
        setInvite((prev) => (prev?.type === "guest" ? { ...prev, status } : prev))
        setChangingResponse(false)
        toast.success(
          status === "CONFIRMADO"
            ? "Presença confirmada com sucesso."
            : "Resposta registrada.",
        )
        action?.()
      } else if (result.error) {
        toast.error(result.error)
      }
    })
  }

  function runFamilyAction(action?: () => void) {
    if (isExpired || !guestToken) return
    startTransition(async () => {
      const result = await respondFamilyAction(guestToken, [...selectedIds])
      if (result.ok) {
        setInvite((prev) => {
          if (prev?.type !== "family") return prev
          return {
            ...prev,
            members: prev.members.map((m) => ({
              ...m,
              status: selectedIds.has(m.id) ? "CONFIRMADO" : "NAO_CONFIRMADO",
            })),
          }
        })
        setFamilyModalOpen(false)
        setChangingResponse(false)
        toast.success("Presença confirmada com sucesso.")
        action?.()
      } else if (result.error) {
        toast.error(result.error)
      }
    })
  }

  function runDeclineFamilyAction() {
    if (isExpired || !guestToken) return
    // decline all members
    if (invite?.type === "family") {
      const rep = invite.members.find((m) => m.isRepresentante)
      const onlyRep = rep ? new Set([rep.id]) : new Set<string>()
      setSelectedIds(onlyRep)
    }
    startTransition(async () => {
      const repId =
        invite?.type === "family"
          ? invite.members.find((m) => m.isRepresentante)?.id
          : undefined
      const ids = repId ? [repId] : []
      const result = await respondFamilyAction(guestToken!, ids)
      if (result.ok) {
        setInvite((prev) => {
          if (prev?.type !== "family") return prev
          return {
            ...prev,
            members: prev.members.map((m) => ({
              ...m,
              status: m.isRepresentante ? "CONFIRMADO" : "NAO_CONFIRMADO",
            })),
          }
        })
        setChangingResponse(false)
        toast.success("Resposta registrada.")
        onDecline?.()
      } else if (result.error) {
        toast.error(result.error)
      }
    })
  }

  const confirmedCount =
    invite?.type === "family"
      ? invite.members.filter((m) => m.status === "CONFIRMADO").length
      : 0

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
          {invite?.type === "guest"
            ? `Olá, ${invite.name}`
            : invite?.type === "family"
              ? `Família ${invite.familyName}`
              : "Sua presença é o melhor presente"}
        </p>
        <h2 className="m-0 font-['Playfair_Display'] text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.04em]">
          Vamos comemorar juntos?
        </h2>
        <p className="mx-auto my-6 mb-8 max-w-[500px] leading-[1.7] text-[rgb(52_64_48_/_67%)]">
          Confirme sua presença para prepararmos cada detalhe dessa festa com muito
          carinho.
        </p>

        {/* Individual guest flow */}
        {(!invite || invite.type === "guest") &&
          (guestStatus !== "AGUARDANDO" && !changingResponse ? (
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
                onClick={() => runGuestAction("CONFIRMADO", onConfirm)}
              >
                {pending ? <Loader2 className="animate-spin" /> : <CheckIcon />}
                {pending ? "Enviando..." : "Confirmar presença"}
              </Button>
              <Button
                variant="outline"
                className="min-h-[54px] rounded-full border-[rgb(116_128_104_/_28%)] bg-transparent px-6 text-[0.76rem] tracking-[0.06em] text-[var(--sage-dark)] hover:bg-[var(--cream)] max-[600px]:w-full"
                type="button"
                disabled={isExpired || pending}
                onClick={() => runGuestAction("NAO_CONFIRMADO", onDecline)}
              >
                {pending ? <Loader2 className="animate-spin" /> : null}
                {pending ? "Enviando..." : "Não poderei ir"}
              </Button>
            </div>
          ))}

        {/* Family flow */}
        {invite?.type === "family" &&
          (familyAlreadyResponded && !changingResponse ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-[var(--sage-dark)]">
                {confirmedCount > 0
                  ? `${confirmedCount} membro${confirmedCount > 1 ? "s" : ""} confirmado${confirmedCount > 1 ? "s" : ""}.`
                  : "Nenhum membro confirmou presença."}
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
                disabled={isExpired}
                onClick={() => setFamilyModalOpen(true)}
              >
                <CheckIcon />
                Confirmar presença
              </Button>
              <Button
                variant="outline"
                className="min-h-[54px] rounded-full border-[rgb(116_128_104_/_28%)] bg-transparent px-6 text-[0.76rem] tracking-[0.06em] text-[var(--sage-dark)] hover:bg-[var(--cream)] max-[600px]:w-full"
                type="button"
                disabled={isExpired || pending}
                onClick={runDeclineFamilyAction}
              >
                {pending ? <Loader2 className="animate-spin" /> : null}
                {pending ? "Enviando..." : "Ninguém poderá ir"}
              </Button>
            </div>
          ))}

        {invite?.type === "family" && (
          <Dialog open={familyModalOpen} onOpenChange={setFamilyModalOpen}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Quem vai comparecer?</DialogTitle>
                <DialogDescription>
                  Selecione quem da família confirmará presença na festa.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                {invite.members.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      selectedIds.has(m.id)
                        ? "border-[var(--sage)] bg-[var(--sage)]/10"
                        : "border-border bg-transparent hover:bg-secondary/40"
                    } ${m.isRepresentante ? "cursor-default" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="size-4 accent-[var(--sage)]"
                      checked={selectedIds.has(m.id)}
                      onChange={() => toggleMember(m.id, m.isRepresentante)}
                      disabled={m.isRepresentante}
                    />
                    <span className="flex-1 text-sm font-medium">
                      {m.isRepresentante ? `Eu (${m.nome})` : m.nome}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tipoLabel(m.tipo)}
                    </span>
                  </label>
                ))}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setFamilyModalOpen(false)}
                  disabled={pending}
                  size="lg"
                >
                  Cancelar
                </Button>
                <Button
                  disabled={isExpired || pending}
                  onClick={() => runFamilyAction(onConfirm)}
                  size="lg"
                >
                  {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                  {pending ? "Enviando..." : "Confirmar presença"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
