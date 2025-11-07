import { UpdateUserInput, User } from "@/third-task/types/user.schema";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    gender: "male",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    gender: "female",
    status: "inactive",
  },
];

export const mockUpdateUser: UpdateUserInput = {
  name: "John Doe",
  email: "john@example.com",
  gender: "male",
  status: "active",
};
