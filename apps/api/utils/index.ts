export function generateUlid(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 36).toString(36),
  ).join("");
  return timestamp + randomPart;
}

export function generateNanoid(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
