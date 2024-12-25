export const generateInvoiceId = () => {
  return Math.floor(Math.random() * 100000) + "-" + Date.now();
};