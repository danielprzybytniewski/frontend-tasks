import { scrambleText, scrambleWord } from "@/first-task/utils/scramble";

describe("scrambleWord", () => {
  test("returns the same word if it has 3 or fewer characters", () => {
    expect(scrambleWord("hi")).toBe("hi");
    expect(scrambleWord("cat")).toBe("cat");
  });

  test("returns a word of the same length", () => {
    const word = "testing";
    const result = scrambleWord(word);
    expect(result).toHaveLength(word.length);
  });

  test("keeps the first and last characters unchanged", () => {
    const word = "scramble";
    const result = scrambleWord(word);
    expect(result[0]).toBe(word[0]);
    expect(result[word.length - 1]).toBe(word[word.length - 1]);
  });

  test("preserves letter casing for middle characters", () => {
    const word = "HeLLo";
    const result = scrambleWord(word);
    expect(result[0]).toBe("H");
    expect(result[result.length - 1]).toBe("o");
    const originalMiddle = word.slice(1, -1);
    const resultMiddle = result.slice(1, -1);
    expect(
      originalMiddle.split("").map((ch) => ch === ch.toUpperCase()),
    ).toEqual(resultMiddle.split("").map((ch) => ch === ch.toUpperCase()));
  });

  test("shuffles middle letters randomly", () => {
    const word = "safafafagvxcsdbzxcvbbnmlkjhgffddssaqwertyuiop";
    const result = scrambleWord(word);
    expect(result).not.toBe(word);
    expect(result.split("").sort()).toEqual(word.split("").sort());
  });
});

describe("scrambleText", () => {
  test("keeps punctuation and spacing unchanged", () => {
    const text = "Hello, world!";
    const result = scrambleText(text);
    expect(result.includes(",")).toBe(true);
    expect(result.endsWith("!")).toBe(true);
  });

  test("handles Unicode and accented letters correctly", () => {
    const text = "Gęś i żaba";
    const result = scrambleText(text);
    expect(result).toHaveLength(text.length);
    expect(result.includes("ę")).toBe(true);
    expect(result.includes("ż")).toBe(true);
  });

  test("returns empty string for empty input", () => {
    expect(scrambleText("")).toBe("");
  });
});
