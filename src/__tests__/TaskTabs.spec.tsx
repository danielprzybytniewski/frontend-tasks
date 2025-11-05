import { render, screen } from "@testing-library/react";
import TaskTabs from "@/components/TaskTabs";

describe("TaskTabs", () => {
  beforeEach(() => {
    render(<TaskTabs />);
  });

  test("renders TextScrambler component", () => {
    expect(
      screen.getByRole("heading", { name: /Text Scrambler/i, level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/text file/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Process File/i }),
    ).toBeInTheDocument();
  });

  test("renders PESELChecker component", () => {
    expect(
      screen.getByRole("heading", { name: /PESEL Checker/i, level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/PESEL/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear/i })).toBeInTheDocument();
  });
});
