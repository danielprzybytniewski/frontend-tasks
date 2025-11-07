import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function AlertUser() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Alert
      variant="destructive"
      className="mx-auto mt-6 mb-4 max-w-6xl bg-yellow-100 px-2 py-4 pb-4"
    >
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        <p>
          To edit users, add your access token from the
          <a
            href="https://gorest.co.in/consumer/login"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline"
          >
            GoREST API
          </a>
          , setting an environment variable
          <code className="mx-1 rounded bg-red-200 px-1">
            VITE_GOREST_API_TOKEN
          </code>
          in file <code className="rounded bg-red-200 px-1">.env.local</code>.
        </p>
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 h-6 w-6 text-yellow-800 hover:cursor-pointer hover:bg-yellow-200"
        aria-label="Close alert"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
