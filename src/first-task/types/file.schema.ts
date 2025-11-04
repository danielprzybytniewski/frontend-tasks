import { z } from "zod";

export const fileSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine(
      (fileList) => fileList.length > 0,
      "Please select a text file (.txt)",
    )
    .refine(
      (fileList) => fileList[0]?.type === "text/plain",
      "The uploaded file must be a .txt file",
    ),
});

export type FileValidation = z.infer<typeof fileSchema>;
