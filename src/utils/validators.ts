export const regex = {
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  amount: /^\d+(\.\d{1,2})?$/,
  invoiceNo: /^[A-Z0-9\-\/]+$/i,
}
