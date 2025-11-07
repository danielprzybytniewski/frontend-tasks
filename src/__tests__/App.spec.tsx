import { screen } from "@testing-library/react";
import App from "@/App";
import { renderWithQueryClient } from "@/lib/test-utils";

describe("App", () => {
  beforeEach(() => {
    renderWithQueryClient(<App />);
  });

  test("renders title", () => {
    expect(
      screen.getByRole("heading", { name: /Frontend Tasks/i }),
    ).toBeInTheDocument();
  });

  test("renders TaskTabs component", () => {
    expect(
      screen.getByRole("heading", { name: /First Task - Text Scrambler/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Second Task - PESEL Checker/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Third Task - Users/i }),
    ).toBeInTheDocument();
  });
});
