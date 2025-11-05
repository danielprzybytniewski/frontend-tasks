import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PersonDataProps } from "@/second-task/components/PersonData";
import PersonData from "@/second-task/components/PersonData";
import { peselSchema, PeselValidation } from "@/second-task/types/pesel.schema";
import { decodePesel } from "@/second-task/utils/pesel";

export default function PeselChecker() {
  const [personData, setPersonData] = useState<null | PersonDataProps>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PeselValidation>({
    resolver: zodResolver(peselSchema),
    mode: "onChange",
  });

  const onSubmit = (data: { pesel: string }) => {
    const info = decodePesel(data.pesel);
    setPersonData(info);
  };

  const handleReset = () => {
    reset();
    setPersonData(null);
  };

  return (
    <>
      <div className="flex flex-col items-center p-6">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-200">
          <h3 className="mb-6 flex items-center justify-center gap-3 text-center text-3xl font-extrabold text-emerald-700 drop-shadow-sm">
            <Lock className="inline size-8 text-emerald-600" /> PESEL Checker
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="pesel"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                PESEL
              </label>
              <Input
                id="pesel"
                type="text"
                inputMode="numeric"
                maxLength={11}
                placeholder="e.g. 88040311892"
                {...register("pesel")}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-6 text-gray-900 shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300"
              />
              {errors.pesel && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.pesel.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer rounded-lg bg-linear-to-r from-emerald-600 to-emerald-500 py-6 text-lg font-semibold text-white shadow-md transition hover:from-emerald-700 hover:to-emerald-600 active:scale-95"
            >
              Check PESEL
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              className="w-full cursor-pointer rounded-lg bg-slate-500 py-6 text-center text-lg text-white shadow-md transition hover:bg-slate-600 active:scale-95"
            >
              Clear
            </Button>
          </form>
          {personData && <PersonData personData={personData} />}
        </div>
      </div>
    </>
  );
}
