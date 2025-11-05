import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextScrambler from "@/first-task/components/TextScrambler";
import { cn } from "@/lib/utils";
import PeselChecker from "@/second-task/components/PeselChecker";

export default function TaskTabs() {
  const [activeTab, setActiveTab] = useState("textScrambler");

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-4">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-3xl"
      >
        <TabsList className="mx-auto mb-5 grid grid-cols-2 rounded-2xl p-2">
          <TabsTrigger
            value="textScrambler"
            className={cn(
              "mr-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all md:text-base",
              activeTab === "textScrambler"
                ? "bg-linear-to-r from-blue-500 to-blue-400 text-white shadow outline-0"
                : "bg-gray-100 text-gray-700 outline hover:cursor-pointer hover:bg-gray-200 hover:text-blue-600",
            )}
          >
            <h2>First Task - Text Scrambler</h2>
          </TabsTrigger>
          <TabsTrigger
            value="peselChecker"
            className={cn(
              "rounded-xl px-4 py-3 text-sm font-semibold transition-all md:text-base",
              activeTab === "peselChecker"
                ? "bg-linear-to-r from-emerald-500 to-emerald-400 text-white shadow outline-0"
                : "bg-gray-100 text-gray-700 outline hover:cursor-pointer hover:bg-gray-200 hover:text-emerald-600",
            )}
          >
            <h2>Second Task - PESEL Checker</h2>
          </TabsTrigger>
        </TabsList>
        <div className={cn(activeTab === "textScrambler" ? "block" : "hidden")}>
          <TextScrambler />
        </div>
        <div className={cn(activeTab === "textScrambler" ? "hidden" : "block")}>
          <PeselChecker />
        </div>
      </Tabs>
    </div>
  );
}
