import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskTabs from "@/components/TaskTabs";
import { renderWithQueryClient } from "@/lib/test-utils";

describe("TaskTabs", () => {
  beforeEach(() => {
    renderWithQueryClient(<TaskTabs />);
  });

  const setup = () => {
    const textScrambler = screen.getAllByTestId("text-scrambler-container")[0];
    const peselChecker = screen.getAllByTestId("pesel-checker-container")[0];
    const users = screen.getAllByTestId("users-container")[0];
    return { textScrambler, peselChecker, users };
  };

  test("renders TextScrambler component", () => {
    expect(
      screen.getByRole("heading", { name: /Text Scrambler/i, level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/text file/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Process File/i }),
    ).toBeInTheDocument();
  });

  test("renders PeselChecker component", () => {
    expect(
      screen.getByRole("heading", { name: /PESEL Checker/i, level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/PESEL/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear/i })).toBeInTheDocument();
  });

  test("renders Users component", () => {
    expect(
      screen.getByRole("heading", { name: /Users/i, level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Users List/i)).toBeInTheDocument();
  });

  test("shows TextScrambler by default", () => {
    const { textScrambler, peselChecker } = setup();

    expect(textScrambler).toBeVisible();
    expect(peselChecker).toHaveClass("hidden");
  });

  test("switches from TextScrambler to PeselChecker when clicking tab", async () => {
    const user = userEvent.setup();
    const { textScrambler, peselChecker } = setup();

    expect(textScrambler).toBeVisible();
    expect(peselChecker).toHaveClass("hidden");

    await user.click(
      screen.getAllByRole("heading", {
        name: /Second Task - PESEL Checker/i,
      })[0],
    );

    expect(textScrambler).toHaveClass("hidden");
    expect(peselChecker).toBeVisible();
  });

  test("switches from PeselChecker to Users when clicking tab", async () => {
    const user = userEvent.setup();
    const { peselChecker, users } = setup();

    expect(peselChecker).toBeVisible();
    expect(users).toHaveClass("hidden");

    await user.click(
      screen.getAllByRole("heading", {
        name: /Users/i,
      })[0],
    );

    expect(peselChecker).toHaveClass("hidden");
    expect(users).toBeVisible();
  });
});
