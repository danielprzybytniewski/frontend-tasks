import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ResultArea } from "@/first-task/components/ResultArea";

describe("ResultArea", () => {
  const sampleText = "This is scrambled output";

  test("renders result heading and textarea", () => {
    render(<ResultArea output={sampleText} />);
    expect(screen.getByText("📄 Result:")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue(sampleText);
  });

  test("renders download and copy buttons", () => {
    render(<ResultArea output={sampleText} />);
    expect(
      screen.getByRole("button", { name: /Download Result/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Copy to Clipboard/i }),
    ).toBeInTheDocument();
  });

  test("copies text to clipboard and shows copied state", async () => {
    const user = userEvent.setup();
    const writeTextMock = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValueOnce(undefined);

    render(<ResultArea output={sampleText} />);
    const copyButton = screen.getByRole("button", {
      name: /Copy to Clipboard/i,
    });

    await user.click(copyButton);
    expect(writeTextMock).toHaveBeenCalledWith(sampleText);
    expect(screen.getByRole("button", { name: /Copied!/i })).toBeDisabled();

    await waitFor(
      () => {
        expect(
          screen.getByRole("button", { name: /Copy to Clipboard/i }),
        ).not.toBeDisabled();
      },
      { timeout: 3500 },
    );
  });

  test("triggers download when clicking download button", async () => {
    const user = userEvent.setup();

    const createObjectURLMock = vi.fn().mockReturnValue("blob:url");
    const revokeObjectURLMock = vi.fn();
    const clickMock = vi.fn();

    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;
    HTMLAnchorElement.prototype.click = clickMock;

    render(<ResultArea output={sampleText} />);

    const downloadButton = screen.getByRole("button", {
      name: /Download Result/i,
    });

    await user.click(downloadButton);

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();

    expect(revokeObjectURLMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:url");

    expect(downloadButton).toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
