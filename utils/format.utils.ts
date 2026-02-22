export function formatDateISO(date: Date): string {
  return date.toISOString();
}

export function formatPhoneE164(phone: string): string {
  // naive implementation: ensure leading + and digits
  if (!phone.startsWith("+")) {
    return `+${phone}`;
  }
  return phone;
}
