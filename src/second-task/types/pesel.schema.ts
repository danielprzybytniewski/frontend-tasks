import { z } from "zod";
import { isPeselValid } from "@/second-task/utils/pesel";

export const peselSchema = z.object({
  pesel: z
    .string()
    .regex(/^[0-9]*$/, "PESEL can contain digits only")
    .min(11, { message: "PESEL must be 11 digits long" })
    .max(11, { message: "PESEL must be 11 digits long" })
    .refine(isPeselValid, {
      message: "Invalid PESEL (date or checksum)",
    }),
});

export type PeselValidation = z.infer<typeof peselSchema>;
