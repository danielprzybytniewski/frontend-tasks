import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SearchUser from "@/third-task/components/SearchUser";

describe("SearchUser", () => {
  const rendersSearchUser = (propsOverrides = {}) => {
    const defaultProps = {
      search: "",
      searchInput: "",
      setSearchInput: vi.fn(),
      handleSearch: vi.fn(),
      handleClearSearch: vi.fn(),
      handleKeyPress: vi.fn(),
    };

    const props = { ...defaultProps, ...propsOverrides };

    render(<SearchUser {...props} />);

    return { ...props };
  };

  test("renders input and search button", () => {
    rendersSearchUser();
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  test("disables Search button when input is empty", () => {
    rendersSearchUser({ searchInput: "" });
    expect(screen.getByRole("button", { name: /search/i })).toBeDisabled();
  });

  test("enables Search button when input has text", () => {
    rendersSearchUser({ searchInput: "John" });
    expect(screen.getByRole("button", { name: /search/i })).toBeEnabled();
  });

  test("updates input on typing", async () => {
    const user = userEvent.setup();
    const { setSearchInput } = rendersSearchUser();

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "Jane");

    expect(setSearchInput).toHaveBeenCalled();
    expect(setSearchInput).toHaveBeenCalledWith("J");
  });

  it("triggers search when Search button is clicked", async () => {
    const user = userEvent.setup();
    const { handleSearch } = rendersSearchUser({ searchInput: "Alice" });

    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  test("triggers search when key is pressed", async () => {
    const user = userEvent.setup();
    const { handleKeyPress } = rendersSearchUser();

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "Jane");

    expect(handleKeyPress).toHaveBeenCalled();
  });

  test("renders Clear button when search is active", () => {
    rendersSearchUser({ search: "John" });
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  test("clears search input when Clear button is clicked", async () => {
    const user = userEvent.setup();
    const { handleClearSearch } = rendersSearchUser({ search: "John" });

    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(handleClearSearch).toHaveBeenCalledTimes(1);
  });
});
