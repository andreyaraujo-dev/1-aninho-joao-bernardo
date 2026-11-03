export const birthdayDate = new Date("2026-11-29T23:59:59-03:00")

export function isBirthdayPast(now = new Date()) {
  return now > birthdayDate
}
