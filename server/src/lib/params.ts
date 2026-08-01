export function requireParam(
  value: unknown,
  name: string
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing or invalid parameter: ${name}`);
  }

  return value;
}