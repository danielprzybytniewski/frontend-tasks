import { z } from "zod";
import {
  type UpdateUserInput,
  UpdateUserSchema,
  type User,
  UserSchema,
} from "@/third-task/types/user.schema";

const BASE_URL = "https://gorest.co.in/public/v2";

function getToken(): string | undefined {
  return import.meta.env.VITE_GOREST_API_TOKEN;
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchUsers({
  page = 1,
  per_page = 20,
  search,
}: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<User[]> {
  const q = new URLSearchParams();
  q.set("page", String(page));
  q.set("per_page", String(per_page));

  if (search) {
    q.set("name", search);
  }

  const res = await fetch(`${BASE_URL}/users?${q.toString()}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.status}`);
  }

  const data = await res.json();
  const result = z.array(UserSchema).safeParse(data);

  if (!result.success) {
    console.error("Response validation issues:", result.error.issues);
    throw new Error(`Invalid API response: ${result.error.message}`);
  }

  return result.data;
}

export async function updateUser(
  id: number,
  payload: UpdateUserInput,
): Promise<User> {
  const token = getToken();

  if (!token) {
    throw new Error("No acces token found. Please add your token to .env file");
  }

  const validationResult = UpdateUserSchema.safeParse(payload);

  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(validationResult.data),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to update user. Server responded with status ${res.status}.`,
    );
  }

  const data = await res.json();
  const result = UserSchema.safeParse(data);

  if (!result.success) {
    console.error("Response validation issues:", result.error.issues);
    throw new Error(`Invalid API response: ${result.error.message}`);
  }

  return result.data;
}
