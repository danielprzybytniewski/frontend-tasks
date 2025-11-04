import { render, screen } from "@testing-library/react";
import App from "@/App";

describe("App", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("renders title", () => {
    expect(
      screen.getByRole("heading", { name: /Frontend Tasks/i }),
    ).toBeInTheDocument();
  });

  test("renders TextScrambler component", () => {
    expect(
      screen.getByRole("heading", { name: /First Task - Text Scrambler/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/text file/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Process File/i }),
    ).toBeInTheDocument();
  });
});
