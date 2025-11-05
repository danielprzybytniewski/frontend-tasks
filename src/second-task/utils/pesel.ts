function isLeap(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function decodeCenturyAndMonth(mm: number) {
  const centuries = [
    [81, 92, 1800, 80],
    [1, 12, 1900, 0],
    [21, 32, 2000, 20],
    [41, 52, 2100, 40],
    [61, 72, 2200, 60],
  ] as const;

  return centuries.find(([min, max]) => mm >= min && mm <= max);
}

export function isPeselValid(pesel: string): boolean {
  if (!/^\d{11}$/.test(pesel)) return false;

  const digits = pesel.split("").map(Number);
  const weights = [1, 3, 7, 9];
  const sum = digits
    .slice(0, 10)
    .reduce((a, n, i) => a + n * weights[i % 4], 0);
  if ((10 - (sum % 10)) % 10 !== digits[10]) return false;

  const [yy, mm, dd] = [
    parseInt(pesel.slice(0, 2)),
    parseInt(pesel.slice(2, 4)),
    parseInt(pesel.slice(4, 6)),
  ];
  const century = decodeCenturyAndMonth(mm);
  if (!century) return false;

  const [, , cent, offset] = century;
  const year = cent + yy;
  const daysInMonth = [
    31,
    isLeap(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return (
    mm - offset >= 1 &&
    mm - offset <= 12 &&
    dd >= 1 &&
    dd <= daysInMonth[mm - offset - 1]
  );
}

export function decodePesel(pesel: string) {
  const [yy, mm, dd] = [
    parseInt(pesel.slice(0, 2)),
    parseInt(pesel.slice(2, 4)),
    parseInt(pesel.slice(4, 6)),
  ];
  const century = decodeCenturyAndMonth(mm)!;
  const [, , cent, offset] = century;
  const actualMm = mm - offset;
  const year = cent + yy;
  const birthDate = new Date(year, actualMm - 1, dd);

  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() < actualMm - 1 ||
    (today.getMonth() === actualMm - 1 && today.getDate() < dd)
  )
    age--;

  const gender = parseInt(pesel[9]) % 2 ? "Male" : "Female";

  return { gender, birthDate: birthDate.toLocaleDateString("pl-PL"), age };
}
