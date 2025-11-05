import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextScrambler from "@/first-task/components/TextScrambler";
import { scrambleText } from "@/first-task/utils/scramble";

jest.mock("@/first-task/utils/scramble", () => ({
  scrambleText: jest.fn().mockReturnValue("scrambled text output"),
}));

describe("TextScrambler", () => {
  const mockScrambleText = scrambleText as jest.Mock;

  const setup = () => {
    render(<TextScrambler />);
    const user = userEvent.setup();
    return { user };
  };

  const uploadFile = async (
    user: ReturnType<typeof userEvent.setup>,
    {
      content = "content",
      name = "test.txt",
      type = "text/plain",
      label = /text file/i,
    } = {},
  ) => {
    const file = new File([content], name, { type });
    file.text = jest.fn().mockResolvedValue(content);

    const input = screen.getByLabelText(label);
    await user.upload(input, file);
    return file;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders heading", () => {
    setup();
    expect(
      screen.getByRole("heading", { name: /Text Scrambler/i, level: 3 }),
    ).toBeInTheDocument();
  });

  test("renders file input and process button", () => {
    setup();
    expect(screen.getByLabelText(/text file/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Process File/i }),
    ).toBeInTheDocument();
  });

  test("does not render clear button initially", () => {
    setup();
    expect(
      screen.queryByRole("button", { name: /Clear/i }),
    ).not.toBeInTheDocument();
  });

  test("does not render result area initially", () => {
    setup();
    expect(screen.queryByText(/📄 Result:/i)).not.toBeInTheDocument();
  });

  test("processes valid text file and displays output", async () => {
    const { user } = setup();

    await uploadFile(user);
    await user.click(screen.getByRole("button", { name: /Process File/i }));

    await waitFor(() => {
      expect(screen.getByText(/📄 Result:/i)).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveValue("scrambled text output");
    });
  });

  test("changes button text to 'Regenerate' after processing", async () => {
    const { user } = setup();

    await uploadFile(user);
    await user.click(screen.getByRole("button", { name: /Process File/i }));

    const regenerateButton = await screen.findByRole("button", {
      name: /Regenerate/i,
    });
    expect(regenerateButton).toBeInTheDocument();
  });

  test("shows clear button after processing", async () => {
    const { user } = setup();

    await uploadFile(user);
    await user.click(screen.getByRole("button", { name: /Process File/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Clear/i }),
      ).toBeInTheDocument();
    });
  });

  test("regenerates output with different scramble when clicking regenerate", async () => {
    const { user } = setup();
    mockScrambleText
      .mockReturnValueOnce("first scramble")
      .mockReturnValueOnce("second scramble");

    await uploadFile(user);
    await user.click(screen.getByRole("button", { name: /Process File/i }));

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("first scramble");
    });

    await user.click(screen.getByRole("button", { name: /Regenerate/i }));

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("second scramble");
    });
  });

  test("clears output and resets form when clicking clear", async () => {
    const { user } = setup();

    await uploadFile(user);
    await user.click(screen.getByRole("button", { name: /Process File/i }));

    await waitFor(() => {
      expect(screen.getByText(/📄 Result:/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Clear/i }));

    expect(screen.queryByText(/📄 Result:/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Clear/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Process File/i }),
    ).toBeInTheDocument();
  });

  test("handles empty file correctly", async () => {
    const { user } = setup();

    await uploadFile(user, { content: "", name: "empty.txt" });
    await user.click(screen.getByRole("button", { name: /Process File/i }));

    await waitFor(() => {
      expect(mockScrambleText).toHaveBeenCalledWith("");
      expect(screen.getByText(/📄 Result:/i)).toBeInTheDocument();
    });
  });

  test("shows validation error for non-text file", async () => {
    const { user } = setup();

    await uploadFile(user, { name: "test.pdf", type: "application/pdf" });
    await user.click(screen.getByRole("button", { name: /Process File/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Please select a text file/i),
      ).toBeInTheDocument();
    });
  });
});
