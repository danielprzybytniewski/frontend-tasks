import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import { mockUsers } from "@/third-task/__mocks__/mockData";
import EditUser from "@/third-task/components/EditUser";
import { useUpdateUserMutation } from "@/third-task/hooks/useUpdateUserMutation";
import { User } from "@/third-task/types/user.schema";

vi.mock("@/third-task/hooks/useUpdateUserMutation", () => ({
  useUpdateUserMutation: vi.fn(),
}));

describe("EditUser", () => {
  function renderEditUser(user: User, open: boolean) {
    render(<EditUser user={user} open={open} onOpenChange={vi.fn()} />);
  }

  const setupMutationMock = (
    overrides?: Partial<ReturnType<typeof useUpdateUserMutation>>,
  ) => {
    vi.mocked(useUpdateUserMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      error: { name: "error", message: "Something went wrong" },
      ...overrides,
    } as ReturnType<typeof useUpdateUserMutation>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders dialog with title and default values", () => {
    setupMutationMock();
    renderEditUser(mockUsers[0], true);

    expect(screen.getByText(/edit user/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/email/i)).toHaveValue("john@example.com");
  });

  test("updates user data when Save is clicked", async () => {
    const mutate = vi.fn();
    setupMutationMock({ mutate });
    renderEditUser(mockUsers[0], true);

    const user = userEvent.setup();
    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), "Jane Doe");

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Jane Doe" }),
    );
  });

  test("close dialog on success", async () => {
    const onOpenChange = vi.fn();
    const mutate = vi.fn();

    let onSuccessCallback: ((user: User) => void) | undefined;

    vi.mocked(useUpdateUserMutation).mockImplementation((_user, options) => {
      onSuccessCallback = options?.onSuccess;
      return {
        mutate,
        mutateAsync: vi.fn(),
        reset: vi.fn(),
        isPending: false,
        isIdle: true,
        isError: false,
        isSuccess: false,
        status: "idle",
        data: undefined,
        error: null,
        variables: undefined,
        context: undefined,
        failureCount: 0,
        failureReason: null,
        isPaused: false,
        submittedAt: 0,
      } as ReturnType<typeof useUpdateUserMutation>;
    });

    render(
      <EditUser user={mockUsers[0]} open={true} onOpenChange={onOpenChange} />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /save/i }));

    onSuccessCallback?.(mockUsers[0]);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("shows error message when mutation isError is true", () => {
    setupMutationMock({
      isError: true,
      error: { name: "error", message: "Update failed" },
    });
    renderEditUser(mockUsers[0], true);

    expect(screen.getByText(/update failed/i)).toBeInTheDocument();
  });
});
