import { useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileInput from "@/first-task/components/FileInput";
import { fileSchema, FileValidation } from "@/first-task/types/file.schema";
import { scrambleText } from "@/first-task/utils/scramble";
import { ResultArea } from "./ResultArea";

export default function TextScrambler() {
  const [output, setOutput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FileValidation>({ resolver: zodResolver(fileSchema) });

  const onSubmit = async (data: FileValidation) => {
    const file = data.file[0];
    const text = await file.text();
    const scrambled = scrambleText(text);
    setOutput(scrambled);
  };

  const error = errors.file as FieldError | undefined;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-200">
        <h3 className="mb-6 flex items-center justify-center gap-3 text-center text-3xl font-extrabold text-blue-700 drop-shadow-sm">
          <Shuffle className="inline size-8 text-blue-500" /> Text Scrambler
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FileInput register={register} error={error} />
          <Button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-linear-to-r from-blue-600 to-blue-500 py-6 text-lg font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-blue-600 active:scale-95"
          >
            {output ? "Regenerate" : "Process File"}
          </Button>
          {output && (
            <Button
              type="button"
              onClick={() => {
                setOutput("");
                reset();
              }}
              className="w-full cursor-pointer rounded-lg border border-gray-300 bg-red-500 py-6 text-center text-lg text-gray-50 transition hover:bg-red-600 active:scale-95"
            >
              Clear
            </Button>
          )}
        </form>
        {output && <ResultArea output={output} />}
      </div>
    </div>
  );
}
