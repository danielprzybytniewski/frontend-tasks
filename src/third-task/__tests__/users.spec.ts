import { beforeEach, describe, expect, vi } from "vitest";
import { mockUpdateUser, mockUsers } from "@/third-task/__mocks__/mockData";
import { authHeaders, fetchUsers, updateUser } from "@/third-task/api/users";

const mockJson = vi.fn();
const mockFetch = vi.fn();

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.resetAllMocks();
  global.fetch = mockFetch;
});

describe("fetchUsers", () => {
  test("calls correct URL with query params", async () => {
    mockJson.mockResolvedValue(mockUsers);
    mockFetch.mockResolvedValue({
      ok: true,
      json: mockJson,
    });

    const result = await fetchUsers({ page: 2, per_page: 10, search: "Jane" });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("page=2"),
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(result).toEqual(mockUsers);
  });

  test("throws error when response is not ok", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    await expect(fetchUsers({})).rejects.toThrow("Failed to fetch users: 500");
  });

  test("throws error when response fails validation", async () => {
    mockJson.mockResolvedValue([{ invalid: true }]);
    mockFetch.mockResolvedValue({ ok: true, json: mockJson });

    await expect(fetchUsers({})).rejects.toThrow("Invalid API response");
  });
});

describe("updateUser", () => {
  test("calls PATCH request with correct payload and headers", async () => {
    mockJson.mockResolvedValue(mockUsers[0]);
    mockFetch.mockResolvedValue({ ok: true, json: mockJson });

    const result = await updateUser(mockUsers[0].id, mockUpdateUser);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/users/${mockUsers[0].id}`),
      expect.objectContaining({
        method: "PATCH",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: expect.stringContaining("Bearer"),
        }),
        body: JSON.stringify(mockUpdateUser),
      }),
    );
    expect(result).toEqual(mockUsers[0]);
  });

  test("throws error when token is missing", async () => {
    vi.stubEnv("VITE_GOREST_API_TOKEN", "");

    await expect(updateUser(mockUsers[0].id, mockUpdateUser)).rejects.toThrow(
      "No acces token found. Please add your token to .env file",
    );

    vi.unstubAllEnvs();
  });

  test("returns empty object when token is missing", () => {
    vi.stubEnv("VITE_GOREST_API_TOKEN", "");

    const headers = authHeaders();
    expect(headers).toEqual({});

    vi.unstubAllEnvs();
  });

  test("returns Authorization header when token is present", () => {
    vi.stubEnv("VITE_GOREST_API_TOKEN", "abc123");

    const headers = authHeaders();
    expect(headers).toEqual({ Authorization: "Bearer abc123" });

    vi.unstubAllEnvs();
  });

  test("throws error when PATCH request fails", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 403 });

    await expect(updateUser(mockUsers[0].id, mockUpdateUser)).rejects.toThrow(
      "Failed to update user. Server responded with status 403.",
    );
  });

  test("throws error when response fails validation", async () => {
    mockJson.mockResolvedValue({ invalid: true });
    mockFetch.mockResolvedValue({ ok: true, json: mockJson });

    await expect(updateUser(mockUsers[0].id, mockUpdateUser)).rejects.toThrow(
      "Invalid API response",
    );
  });
});
