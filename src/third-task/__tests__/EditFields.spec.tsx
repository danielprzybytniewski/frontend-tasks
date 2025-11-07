import { UseFormRegister } from "react-hook-form";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import EditFields from "@/third-task/components/EditFields";
import { UpdateUserInput } from "@/third-task/types/user.schema";

describe("EditFields", () => {
  const mockRegister = vi.fn() as UseFormRegister<UpdateUserInput>;

  const setValue = vi.fn();

  function renderEditFields(overrides = {}) {
    const defaultProps = {
      register: mockRegister,
      errors: {},
      setValue: setValue,
      genderValue: "male",
      statusValue: "active",
    };
    const props = { ...defaultProps, ...overrides };

    render(<EditFields {...props} />);
    return props;
  }

  test("renders all form fields", () => {
    renderEditFields();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  test("updates gender value when changed", () => {
    renderEditFields();

    fireEvent.click(screen.getByLabelText(/gender/i));
    fireEvent.click(screen.getByText(/female/i));

    expect(setValue).toHaveBeenCalledWith("gender", "female");
  });

  test("updates status value when changed", () => {
    renderEditFields();

    fireEvent.click(screen.getByLabelText(/status/i));
    fireEvent.click(screen.getByText(/inactive/i));

    expect(setValue).toHaveBeenCalledWith("status", "inactive");
  });

  test("shows error messages when errors are provided", () => {
    renderEditFields({
      errors: {
        name: { message: "Name is required", type: "required" },
        email: { message: "Email is invalid", type: "pattern" },
        gender: { message: "Gender is required", type: "required" },
        status: { message: "Status is required", type: "required" },
      },
      genderValue: "",
      statusValue: "",
    });

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    expect(screen.getByText(/gender is required/i)).toBeInTheDocument();
    expect(screen.getByText(/status is required/i)).toBeInTheDocument();
  });
});
