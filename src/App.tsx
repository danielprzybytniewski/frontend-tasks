import TextScrambler from "@/first-task/components/TextScrambler";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="pt-5 text-center text-5xl">Frontend Tasks</h1>
      <h2 className="pt-20 text-center text-3xl">
        First Task - Text Scrambler
      </h2>
      <TextScrambler />
    </div>
  );
}
