import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function formatDateTime(dateInput: Date | string): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} - ${formattedTime}`;
}

export const getPercentageChange = (
  current: number,
  previous: number,
): string => {
  if (previous === 0 && current > 0) return "+100%";
  if (previous === 0 && current === 0) return "0%";
  const change = ((current - previous) / previous) * 100;
  const rounded = change.toFixed(1);
  return `${change >= 0 ? "+" : ""}${rounded}%`;
};
