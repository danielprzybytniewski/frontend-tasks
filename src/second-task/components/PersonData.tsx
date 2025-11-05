import { Cake, Calendar, User } from "lucide-react";

export interface PersonDataProps {
  gender: string;
  birthDate: string;
  age: number;
}

export default function PersonData({
  personData,
}: {
  personData: PersonDataProps;
}) {
  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-inner">
      <h4 className="mb-4 text-center text-xl font-semibold text-gray-800">
        Data extracted from PESEL
      </h4>
      <div className="space-y-2 text-gray-700">
        <p className="flex items-center gap-2">
          <User className="text-pink-500" size={18} />
          <span className="font-medium">Gender:</span>
          <span>{personData.gender}</span>
        </p>
        <p className="flex items-center gap-2">
          <Calendar className="text-teal-500" size={18} />
          <span className="font-medium">Birth date:</span>
          <span>{personData.birthDate}</span>
        </p>
        <p className="flex items-center gap-2">
          <Cake className="text-rose-500" size={18} />
          <span className="font-medium">Age:</span>
          <span>
            {personData.age === 1 ? "1 year" : `${personData.age} years`}
          </span>
        </p>
      </div>
    </div>
  );
}
