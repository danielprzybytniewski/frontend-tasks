import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import AlertUser from "@/third-task/components/AlertUser";

describe("AlertUser", () => {
  beforeEach(() => {
    render(<AlertUser />);
  });

  test("renders the alert with title and description", () => {
    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(
      screen.getByText(/To edit users, add your access token/i),
    ).toBeInTheDocument();
  });

  test("contains a link to GoREST API with correct attributes", () => {
    const link = screen.getByRole("link", { name: /GoREST API/i });

    expect(link).toHaveAttribute("href", "https://gorest.co.in/consumer/login");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("closes the alert when the close button is clicked", async () => {
    const user = userEvent.setup();
    const closeButton = screen.getByRole("button", { name: /close alert/i });

    await user.click(closeButton);

    expect(screen.queryByText("Warning")).not.toBeInTheDocument();
  });
});
