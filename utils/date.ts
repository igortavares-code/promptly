export const nowIso = () => new Date().toISOString();

export function formatNice(iso?: string | null) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return String(iso);
  }
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);

  const dataStr = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const horaStr = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `Em ${dataStr} às ${horaStr}`;
}