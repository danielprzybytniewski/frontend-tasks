import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import { renderHookWithReactQuery } from "@/lib/test-utils";
import { mockUpdateUser, mockUsers } from "@/third-task/__mocks__/mockData";
import * as usersApi from "@/third-task/api/users";
import { useUpdateUserMutation } from "@/third-task/hooks/useUpdateUserMutation";
import type { User } from "@/third-task/types/user.schema";

vi.mock("@/third-task/api/users");

describe("useUpdateUserMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls updateUser when mutate is called", async () => {
    const mutateFn = vi
      .mocked(usersApi.updateUser)
      .mockResolvedValue(mockUsers[0]);
    const { result } = renderHook(() => useUpdateUserMutation(mockUsers[0]), {
      wrapper: renderHookWithReactQuery,
    });

    await act(async () => {
      result.current.mutate(mockUsers[0]);
    });

    expect(mutateFn).toHaveBeenCalledWith(mockUsers[0].id, mockUsers[0]);
  });

  test("optimistically updates cache on mutate", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    queryClient.setQueryData(["users"], [mockUsers[0]]);

    const { result } = renderHook(() => useUpdateUserMutation(mockUsers[0]), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await act(async () => {
      result.current.mutate(mockUpdateUser);
    });

    const users = queryClient.getQueryData<User[]>(["users"]);
    expect(users![0].name).toBe("John Doe");
  });

  test("rolls back cache if mutation fails", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    queryClient.setQueryData(["users"], [mockUsers[0]]);

    vi.mocked(usersApi.updateUser).mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useUpdateUserMutation(mockUsers[0]), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync(mockUpdateUser);
      } catch {
        console.error("Expected mutation error:", result.current.error);
      }
    });

    const users = queryClient.getQueryData<User[]>(["users"]);
    expect(users![0].name).toBe("John Doe");
  });

  test("calls onSuccess callback after successful mutation", async () => {
    const onSuccess = vi.fn();
    vi.mocked(usersApi.updateUser).mockResolvedValue(mockUsers[0]);

    const { result } = renderHook(
      () => useUpdateUserMutation(mockUsers[0], { onSuccess }),
      { wrapper: renderHookWithReactQuery },
    );

    await act(async () => {
      await result.current.mutateAsync(mockUsers[0]);
    });

    expect(onSuccess).toHaveBeenCalledWith(mockUsers[0]);
  });

  test("does not update users with different ID", async () => {
    const otherUser: User = {
      id: 999,
      name: "Other",
      email: "other@example.com",
      gender: "male",
      status: "active",
    };

    const queryClient = new QueryClient();
    queryClient.setQueryData(["users"], [otherUser]);

    vi.mocked(usersApi.updateUser).mockResolvedValue(mockUsers[0]);

    const { result } = renderHook(() => useUpdateUserMutation(mockUsers[0]), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await act(async () => {
      await result.current.mutateAsync(mockUsers[0]);
    });

    const users = queryClient.getQueryData<User[]>(["users"]);
    expect(users).toEqual([otherUser]);
  });

  test("skips optimistic update in onMutate when oldUsers is undefined", async () => {
    const queryClient = new QueryClient();
    const getQueriesDataSpy = vi
      .spyOn(queryClient, "getQueriesData")
      .mockReturnValue([[["users"], undefined]]);

    const { result } = renderHook(() => useUpdateUserMutation(mockUsers[0]), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await act(async () => {
      result.current.mutate(mockUpdateUser);
    });

    expect(getQueriesDataSpy).toHaveBeenCalled();
    const users = queryClient.getQueryData<User[]>(["users"]);
    expect(users).toBeUndefined();
  });

  test("skips cache update in onSuccess when oldUsers is undefined", async () => {
    const queryClient = new QueryClient();
    const getQueriesDataSpy = vi
      .spyOn(queryClient, "getQueriesData")
      .mockReturnValue([[["users"], undefined]]);

    vi.mocked(usersApi.updateUser).mockResolvedValue(mockUsers[0]);

    const { result } = renderHook(() => useUpdateUserMutation(mockUsers[0]), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await act(async () => {
      await result.current.mutateAsync(mockUsers[0]);
    });

    expect(getQueriesDataSpy).toHaveBeenCalled();
    const users = queryClient.getQueryData<User[]>(["users"]);
    expect(users).toBeUndefined();
  });
});
