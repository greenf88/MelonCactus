const DOSSIER_NUMBER_PATTERN = /^(\d{2})(0[1-9]|1[0-2])(\d{3})$/;

export interface ParsedDossierNumber {
  year: number;
  month: number;
  sequence: number;
}

export function formatDossierNumber(receivedAt: Date, sequence: number): string {
  if (!Number.isInteger(sequence) || sequence < 1 || sequence > 999) {
    throw new RangeError("Dossier sequence must be an integer from 1 through 999.");
  }

  if (Number.isNaN(receivedAt.getTime())) {
    throw new TypeError("A valid receipt date is required.");
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Amsterdam",
    year: "2-digit",
    month: "2-digit",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(receivedAt).map((part) => [part.type, part.value]),
  );

  return `${parts.year}${parts.month}${String(sequence).padStart(3, "0")}`;
}

export function parseDossierNumber(value: string): ParsedDossierNumber {
  const match = DOSSIER_NUMBER_PATTERN.exec(value);
  if (!match) {
    throw new TypeError("Dossier number must use YYMMNNN with a valid month.");
  }

  const sequence = Number(match[3]);
  if (sequence === 0) {
    throw new TypeError("Dossier sequence 000 is not valid.");
  }

  return {
    year: 2000 + Number(match[1]),
    month: Number(match[2]),
    sequence,
  };
}

export function displayDossierNumber(value: string): string {
  const parsed = parseDossierNumber(value);
  return `${String(parsed.year).slice(-2)}-${String(parsed.month).padStart(2, "0")}-${String(parsed.sequence).padStart(3, "0")}`;
}
