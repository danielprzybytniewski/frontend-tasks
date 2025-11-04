import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResultAreaProps {
  output: string;
}

export function ResultArea({ output }: ResultAreaProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scrambled-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-xl font-semibold text-gray-800">📄 Result:</h2>
      <textarea
        readOnly
        value={output}
        className="h-64 w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-4 font-mono text-sm leading-relaxed text-gray-900 shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          onClick={handleDownload}
          className="flex-1 cursor-pointer rounded-lg bg-green-600 px-5 py-6 text-center text-lg text-white shadow-md transition hover:bg-green-700 active:scale-95"
        >
          Download Result
        </Button>
        <Button
          disabled={copied}
          onClick={handleCopy}
          className={cn(
            "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-6 text-center text-lg shadow-md transition hover:bg-blue-600 active:scale-95",
            copied ? "bg-emerald-500" : "bg-blue-500",
          )}
        >
          {copied ? (
            <>
              <Check className="size-5" /> Copied!
            </>
          ) : (
            <>
              <Copy className="size-5" /> Copy to Clipboard
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
