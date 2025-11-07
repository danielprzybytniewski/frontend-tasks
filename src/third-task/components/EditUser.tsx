import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditActions from "@/third-task/components/EditActions";
import EditFields from "@/third-task/components/EditFields";
import { useUpdateUserMutation } from "@/third-task/hooks/useUpdateUserMutation";
import {
  type UpdateUserInput,
  UpdateUserSchema,
  type User,
} from "@/third-task/types/user.schema";

interface EditUserProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditUser({ user, open, onOpenChange }: EditUserProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      gender: user.gender,
      status: user.status,
    },
  });

  const mutation = useUpdateUserMutation(user, {
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const onSubmit = (data: UpdateUserInput) => {
    if (!isDirty) {
      onOpenChange(false);
      return;
    }

    mutation.mutate(data);
  };

  const genderValue = watch("gender");
  const statusValue = watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle asChild>
            <p data-testid="edit-user">Edit User</p>
          </DialogTitle>
          <DialogDescription>
            Update the user details below and save changes
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <EditFields
            register={register}
            errors={errors}
            setValue={setValue}
            genderValue={genderValue}
            statusValue={statusValue}
          />
          {mutation.isError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {mutation.error.message}
            </div>
          )}
          <EditActions
            onOpenChange={onOpenChange}
            isPending={mutation.isPending}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
