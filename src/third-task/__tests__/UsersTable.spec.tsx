import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import { mockUsers } from "@/third-task/__mocks__/mockData";
import UsersTable from "@/third-task/components/UsersTable";

describe("UsersTable", () => {
  function renderUsersTable(overrides = {}) {
    const defaultProps = {
      users: [mockUsers][0],
      setEditingUser: vi.fn(),
    };
    const props = { ...defaultProps, ...overrides };

    render(<UsersTable {...props} />);
    return props;
  }

  test("renders table headers", () => {
    renderUsersTable();
    expect(screen.getByText(/id/i)).toBeInTheDocument();
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/gender/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
  });

  test("renders user row with correct data", () => {
    renderUsersTable();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  test("starts editing when edit button is clicked", async () => {
    const user = userEvent.setup();
    const setEditingUser = vi.fn();
    renderUsersTable({ setEditingUser });

    const editButtons = screen.getAllByRole("button");
    await user.click(editButtons[0]);

    expect(setEditingUser).toHaveBeenCalledWith(mockUsers[0]);
  });

  test("shows 'User not found' when users is empty", () => {
    renderUsersTable({ users: [] });

    expect(screen.getByText(/user not found/i)).toBeInTheDocument();
  });
});
