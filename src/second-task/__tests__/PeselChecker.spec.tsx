import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PeselChecker from "@/second-task/components/PeselChecker";

describe("PeselChecker", () => {
  beforeEach(() => {
    render(<PeselChecker />);
  });

  test("renders heading, input and buttons", () => {
    expect(
      screen.getByRole("heading", { name: /PESEL Checker/i, level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/PESEL/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Check PESEL/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear/i })).toBeInTheDocument();
  });

  test("clears input and result on Clear button", async () => {
    const input = screen.getByLabelText(/PESEL/i);
    const submit = screen.getByRole("button", { name: /Check PESEL/i });
    const clear = screen.getByRole("button", { name: /Clear/i });

    await userEvent.type(input, "88040311892");
    await userEvent.click(submit);

    expect(await screen.findByText(/Gender:/)).toBeInTheDocument();

    await userEvent.click(clear);
    expect(screen.queryByText(/Gender:/)).not.toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe("");
  });

  test("shows validation error for invalid PESEL", async () => {
    const input = screen.getByLabelText(/PESEL/i);
    await userEvent.type(input, "abc");
    expect(
      await screen.findByText(/PESEL can contain digits only/i),
    ).toBeInTheDocument();
  });
});
