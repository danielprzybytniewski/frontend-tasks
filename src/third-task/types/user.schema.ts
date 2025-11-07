import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  gender: z.enum(["male", "female"]),
  status: z.enum(["active", "inactive"]),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  gender: z.enum(["male", "female"]),
  status: z.enum(["active", "inactive"]),
});

export type User = z.infer<typeof UserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
