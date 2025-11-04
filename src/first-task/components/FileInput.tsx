import { FieldError, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FileValidation } from "@/first-task/types/file.schema";

interface FileInputProps {
  register: UseFormRegister<FileValidation>;
  error?: FieldError;
}

export default function FileInput({ register, error }: FileInputProps) {
  return (
    <div>
      <Label
        htmlFor="file"
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        Text file (.txt)
      </Label>
      <Input
        id="file"
        type="file"
        accept=".txt"
        {...register("file")}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-6 text-gray-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
