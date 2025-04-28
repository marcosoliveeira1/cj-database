export function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export function safeParseInt(val: any): number | null {
  if (val === null || val === undefined) return null;
  const num = parseInt(String(val), 10);
  return isNaN(num) ? null : num;
}

export function safeParseFloat(val: any): number | null {
  if (val === null || val === undefined) return null;
  const num = parseFloat(String(val));
  return isNaN(num) ? null : num;
}
