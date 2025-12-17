export type Field = {
  value: string | null
  confidence: number
}

export type InvoiceData = {
  clientName: Field
  clientAddress: Field
  invoiceNumber: Field
  invoiceDate: Field
  totalAmount: Field
  taxableValue: Field
  cgst: Field
  sgst: Field
  igst: Field
  gstNumber: Field
  panNumber: Field
  hsnSacCode: Field
  serviceDescription: Field
}
