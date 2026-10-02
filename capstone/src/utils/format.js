const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const formatPrice = value => money.format(value);
export const stars = rating => "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
