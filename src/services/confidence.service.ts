import { regex } from "../utils/validators.js"

type RawInvoice = Record<string, string | null>

type Field = {
  value: string | null
  confidence: number
}

export function scoreInvoice(
  raw: RawInvoice,
  pageText: string
): Record<string, Field> {

  const result: Record<string, Field> = {}
  const normalizedText = pageText.toLowerCase()

  for (const key of Object.keys(raw)) {
    const value = raw[key]

    const presence = value ? 1 : 0
    const format = formatScore(key, value)
    const keyword = keywordScore(key, value, normalizedText)
    const consistency = consistencyScore(key, value, raw)

    const confidence =
      presence * 0.3 +
      format * 0.3 +
      keyword * 0.2 +
      consistency * 0.2

    result[key] = {
      value,
      confidence: Number(confidence.toFixed(2)),
    }
  }

  return result
}

function formatScore(field: string, value: string | null): number {
  if (!value) return 0

  switch (field) {
    case "gstNumber":
      return regex.gst.test(value) ? 1 : 0.3
    case "panNumber":
      return regex.pan.test(value) ? 1 : 0.3
    case "totalAmount":
    case "taxableValue":
    case "cgst":
    case "sgst":
    case "igst":
      return regex.amount.test(value) ? 1 : 0.3
    case "invoiceNumber":
      return regex.invoiceNo.test(value) ? 1 : 0.4
    default:
      return value.length > 2 ? 1 : 0.3
  }
}

function keywordScore(field: string, value: string | null, text: string): number {
  if (!value) return 0

  const map: Record<string, string[]> = {
    invoiceNumber: ["invoice", "bill"],
    gstNumber: ["gstin"],
    totalAmount: ["total", "amount"],
    taxableValue: ["taxable"],
    cgst: ["cgst"],
    sgst: ["sgst"],
    igst: ["igst"],
  }

  const keywords = map[field] || []
  return keywords.some(k => text.toLowerCase().includes(k)) ? 1 : 0.4
}

function consistencyScore(
  field: string,
  value: string | null,
  raw: Record<string, string | null>
): number {
  if (!value) return 0

  if (field === "totalAmount") {
    const t = num(raw.taxableValue)
    const c = num(raw.cgst)
    const s = num(raw.sgst)
    const i = num(raw.igst)
    const total = num(value)

    if (!t || !total) return 0.5

    const expected = t + c + s + i
    return Math.abs(expected - total) < 2 ? 1 : 0.4
  }

  if (field === "panNumber" && raw.gstNumber) {
    return raw.gstNumber.includes(value) ? 1 : 0.4
  }

  return 0.5
}

const num = (v?: string | null) => v ? Number(v) : 0
