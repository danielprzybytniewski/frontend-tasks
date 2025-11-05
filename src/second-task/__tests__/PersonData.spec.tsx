import { render, screen } from "@testing-library/react";
import PersonData from "@/second-task/components/PersonData";

describe("PersonData", () => {
  test("renders heading, gender, birth date and age correctly", () => {
    render(
      <PersonData
        personData={{
          gender: "Male",
          birthDate: "3.04.1988",
          age: 36,
        }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /Data extracted from PESEL/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Gender:")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();

    expect(screen.getByText("Birth date:")).toBeInTheDocument();
    expect(screen.getByText("3.04.1988")).toBeInTheDocument();

    expect(screen.getByText("Age:")).toBeInTheDocument();
    expect(screen.getByText("36 years")).toBeInTheDocument();
  });

  test("renders '1 year' when age is 1", () => {
    render(
      <PersonData
        personData={{
          gender: "Female",
          birthDate: "1.01.2024",
          age: 1,
        }}
      />,
    );

    expect(screen.getByText("1 year")).toBeInTheDocument();
  });
});
