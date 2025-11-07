import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { renderWithQueryClient } from "@/lib/test-utils";
import { mockUsers } from "@/third-task/__mocks__/mockData";
import * as usersApi from "@/third-task/api/users";
import UsersContainer from "@/third-task/components/UsersContainer";

vi.mock("@/third-task/api/users");

describe("Users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usersApi.fetchUsers).mockResolvedValue(mockUsers);
  });

  test("renders title with subtitle", async () => {
    renderWithQueryClient(<UsersContainer />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Users List from GoREST API")).toBeInTheDocument();
  });

  test("renders loading state initially", () => {
    vi.mocked(usersApi.fetchUsers).mockImplementation(
      () => new Promise(() => {}),
    );

    renderWithQueryClient(<UsersContainer />);

    const loader = screen.getByTestId("loading-state");
    expect(loader).toBeInTheDocument();
  });

  test("renders SearchUser component", async () => {
    renderWithQueryClient(<UsersContainer />);

    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
  });

  test("renders UsersTable when data loads successfully", async () => {
    renderWithQueryClient(<UsersContainer />);

    await waitFor(() => {
      expect(screen.getByTestId("users-table")).toBeInTheDocument();
    });
  });

  test("displays EditUser when editing a user", async () => {
    renderWithQueryClient(<UsersContainer />);

    await waitFor(() => {
      expect(screen.getByTestId("users-table")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const editButton = screen.getAllByTestId("edit-user-button")[0];

    await user.click(editButton);
    expect(screen.getByTestId("edit-user")).toBeInTheDocument();
  });

  test("closes EditUser when dialog is closed", async () => {
    renderWithQueryClient(<UsersContainer />);

    await waitFor(() => {
      expect(screen.getByTestId("users-table")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const editButton = screen.getAllByTestId("edit-user-button")[0];

    await user.click(editButton);

    expect(screen.getByTestId("edit-user")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(screen.queryByTestId("edit-user")).not.toBeInTheDocument();
  });

  test("renders UsersPagination when users data exists", async () => {
    renderWithQueryClient(<UsersContainer />);

    await waitFor(() => {
      expect(screen.getByTestId("users-pagination")).toBeInTheDocument();
    });
  });

  test("does not render UsersPagination when users array is empty", async () => {
    vi.mocked(usersApi.fetchUsers).mockResolvedValue([]);

    renderWithQueryClient(<UsersContainer />);

    await waitFor(() => {
      expect(screen.queryByTestId("users-pagination")).not.toBeInTheDocument();
    });
  });

  test("renders AlertUser", async () => {
    renderWithQueryClient(<UsersContainer />);

    expect(screen.getByText(/warning/i)).toBeInTheDocument();
  });

  test("calls fetchUsers with correct initial parameters", async () => {
    renderWithQueryClient(<UsersContainer />);

    await waitFor(() => {
      expect(usersApi.fetchUsers).toHaveBeenCalledWith({
        page: 1,
        per_page: 10,
        search: "",
      });
    });
  });

  test("displays error message when fetchUsers fails", async () => {
    const errorMessage = "Failed to fetch users: 500";
    vi.mocked(usersApi.fetchUsers).mockRejectedValue(new Error(errorMessage));

    renderWithQueryClient(<UsersContainer />);

    await waitFor(
      () => {
        expect(screen.getByText("Error loading data")).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test("fetch users when search is performed", async () => {
    renderWithQueryClient(<UsersContainer />);

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/search by name/i);

    await user.type(searchInput, "John");
    await user.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(usersApi.fetchUsers).toHaveBeenCalledWith({
        page: 1,
        per_page: 10,
        search: "John",
      });
    });
  });

  test("resets page to 1 when search is cleared", async () => {
    renderWithQueryClient(<UsersContainer />);

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/search by name/i);

    await user.type(searchInput, "Jane");
    await user.click(screen.getByRole("button", { name: /search/i }));

    await user.click(screen.getByRole("button", { name: /clear/i }));

    await waitFor(() => {
      expect(usersApi.fetchUsers).toHaveBeenLastCalledWith({
        page: 1,
        per_page: 10,
        search: "",
      });
    });
  });

  test("triggers search on Enter key press", async () => {
    renderWithQueryClient(<UsersContainer />);

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/search by name/i);

    await user.type(searchInput, "Test");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(usersApi.fetchUsers).toHaveBeenCalledWith({
        page: 1,
        per_page: 10,
        search: "Test",
      });
    });
  });
});
