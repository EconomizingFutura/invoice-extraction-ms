export type RawInvoice = {
  clientName: string | null
  clientAddress: string | null
  invoiceNumber: string | null
  invoiceDate: string | null
  totalAmount: string | null
  taxableValue: string | null
  cgst: string | null
  sgst: string | null
  igst: string | null
  gstNumber: string | null
  panNumber: string | null
  hsnSacCode: string | null
  serviceDescription: string | null
}
