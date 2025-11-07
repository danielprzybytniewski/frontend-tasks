import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import { mockUsers } from "@/third-task/__mocks__/mockData";
import UsersPagination from "@/third-task/components/UsersPagination";

describe("UsersPagination", () => {
  let setPage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setPage = vi.fn();
    vi.clearAllMocks();
  });

  function renderUsersPagination(overrides = {}) {
    const defaultProps = {
      page: 1,
      setPage,
      users: mockUsers,
      perPage: 10,
    };

    const props = { ...defaultProps, ...overrides };

    render(<UsersPagination {...props} />);
    return { props };
  }

  test("renders current page number", () => {
    renderUsersPagination({ page: 2 });

    expect(screen.getByText("Page 2")).toBeInTheDocument();
  });

  test("disables Previous button on first page", async () => {
    const user = userEvent.setup();
    renderUsersPagination({ page: 1 });

    const prevButton = screen.getByRole("button", { name: /previous/i });
    expect(prevButton).toBeDisabled();

    await user.click(prevButton);
    expect(setPage).not.toHaveBeenCalled();
  });

  test("disables Next button when user count is below pagination limit", async () => {
    const user = userEvent.setup();
    renderUsersPagination();

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();

    await user.click(nextButton);
    expect(setPage).not.toHaveBeenCalled();
  });

  test("navigates back one page when Previous button is clicked", async () => {
    const user = userEvent.setup();
    renderUsersPagination({ page: 3, setPage });

    const prevButton = screen.getByRole("button", { name: /previous/i });
    await user.click(prevButton);

    expect(setPage).toHaveBeenCalledWith(2);
  });

  test("navigates forward one page when Next button is clicked", async () => {
    const user = userEvent.setup();

    renderUsersPagination({
      page: 2,
      setPage,
      users: Array(15).fill(mockUsers[0]),
    });

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).not.toBeDisabled();

    await user.click(nextButton);

    expect(setPage).toHaveBeenCalledWith(3);
  });
});
