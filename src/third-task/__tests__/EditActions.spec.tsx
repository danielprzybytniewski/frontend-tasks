import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import { mockUpdateUser } from "@/third-task/__mocks__/mockData";
import EditActions from "@/third-task/components/EditActions";

describe("EditActions", () => {
  function renderEditActions(overrides = {}) {
    const defaultProps = {
      onOpenChange: vi.fn(),
      isPending: false,
      handleSubmit: vi.fn((fn) => fn),
      onSubmit: vi.fn(),
    };

    const props = { ...defaultProps, ...overrides };

    render(<EditActions {...props} />);
    return props;
  }

  test("renders Cancel and Save buttons", () => {
    renderEditActions();

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  test("close editing window when Cancel is clicked", async () => {
    const user = userEvent.setup();

    const { onOpenChange } = renderEditActions();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("submit changes when Save is clicked", async () => {
    const handleSubmit = vi.fn((fn) => () => fn(mockUpdateUser));
    const user = userEvent.setup();

    const { onSubmit } = renderEditActions({ handleSubmit });

    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(handleSubmit).toHaveBeenCalledWith(onSubmit);
    expect(onSubmit).toHaveBeenCalledWith(mockUpdateUser);
  });

  it("shows loader and 'Saving...' when isPending is true", () => {
    renderEditActions({ isPending: true });

    expect(screen.getByText(/saving.../i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /saving.../i })).toBeDisabled();
  });
});
