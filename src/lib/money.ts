export const formatNaira = (kobo: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100);

export const availability = (stock: number) =>
  stock <= 0 ? "Sold" : stock === 1 ? "Only 1 available" : `${stock} available`;

export const whatsappLink = (phone: string, productName: string, url: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I'm interested in "${productName}" ${url}`)}`;
