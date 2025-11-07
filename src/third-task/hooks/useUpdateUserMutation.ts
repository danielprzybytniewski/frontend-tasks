import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/third-task/api/users";
import type { UpdateUserInput, User } from "@/third-task/types/user.schema";

interface UseUpdateUserMutationOptions {
  onSuccess?: (updatedUser: User) => void;
}

export function useUpdateUserMutation(
  user: User,
  options?: UseUpdateUserMutationOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInput) => updateUser(user.id, data),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueriesData<User[]>({
        queryKey: ["users"],
      });

      previousUsers.forEach(([key, oldUsers]) => {
        if (!oldUsers) return;
        queryClient.setQueryData<User[]>(key, (old = []) =>
          old.map((u) => (u.id === user.id ? { ...u, ...newData } : u)),
        );
      });

      return { previousUsers };
    },

    onError: (_err, _newData, context) => {
      if (context?.previousUsers) {
        context.previousUsers.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData);
        });
      }
    },

    onSuccess: (updatedUser) => {
      const allUserQueries = queryClient.getQueriesData<User[]>({
        queryKey: ["users"],
      });

      allUserQueries.forEach(([key, oldUsers]) => {
        if (!oldUsers) return;
        queryClient.setQueryData<User[]>(key, (old = []) =>
          old.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        );
      });

      options?.onSuccess?.(updatedUser);
    },
  });
}
