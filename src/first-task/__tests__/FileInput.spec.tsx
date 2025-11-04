import { UseFormRegister } from "react-hook-form";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileInput from "@/first-task/components/FileInput";
import type { FileValidation } from "@/first-task/types/file.schema";

const mockRegister = jest.fn() as UseFormRegister<FileValidation>;

describe("FileInput", () => {
  test("renders label and file input correctly", () => {
    render(<FileInput register={mockRegister} />);

    const label = screen.getByText(/Text file/i);
    const input = screen.getByLabelText(/Text file/i);

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("accept", ".txt");
  });

  test("allows user to select a file", async () => {
    const user = userEvent.setup();
    render(<FileInput register={mockRegister} />);

    const input = screen.getByLabelText(/Text file/i) as HTMLInputElement;
    const file = new File(["Hello world"], "example.txt", {
      type: "text/plain",
    });

    await user.upload(input, file);

    expect(input.files).toHaveLength(1);
    expect(input.files?.[0]).toStrictEqual(file);
    expect(input.files?.[0].name).toBe("example.txt");
  });

  test("does not render error message when error is undefined", () => {
    render(<FileInput register={mockRegister} />);
    const errorMessage = screen.queryByText(/Please select a text file/i);
    expect(errorMessage).not.toBeInTheDocument();
  });

  test("shows error message when provided", () => {
    render(
      <FileInput
        register={mockRegister}
        error={{ message: "Please select a text file", type: "required" }}
      />,
    );

    const errorMessage = screen.getByText(/Please select a text file/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
