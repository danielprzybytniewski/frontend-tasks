import { UseFormHandleSubmit } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpdateUserInput } from "@/third-task/types/user.schema";

interface EditActionsProps {
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  handleSubmit: UseFormHandleSubmit<UpdateUserInput>;
  onSubmit: (data: UpdateUserInput) => void;
}

export default function EditActions({
  onOpenChange,
  isPending,
  handleSubmit,
  onSubmit,
}: EditActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isPending}
        className="hover:cursor-pointer"
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={isPending}
        className="transition-colors duration-200 hover:cursor-pointer hover:bg-gray-700"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Save
          </>
        )}
      </Button>
    </div>
  );
}
