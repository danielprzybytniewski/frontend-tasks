export function scrambleWord(word: string): string {
  if (word.length <= 3) return word;

  const middle = word.slice(1, -1);
  const shuffled = middle
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  const preserveCase = (src: string, target: string) =>
    target
      .split("")
      .map((ch, i) =>
        src[i] && src[i] === src[i].toUpperCase()
          ? ch.toUpperCase()
          : ch.toLowerCase(),
      )
      .join("");

  return word[0] + preserveCase(middle, shuffled) + word[word.length - 1];
}

export function scrambleText(text: string): string {
  return text.replace(/(\p{L}[\p{L}\p{M}']*\p{L})/gu, (word) =>
    scrambleWord(word),
  );
}
