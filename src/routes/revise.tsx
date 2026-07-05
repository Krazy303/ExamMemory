import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/revise")({
  component: ReviseRedirect,
});

function ReviseRedirect() {
  useEffect(() => {
    window.location.replace("/question-bank?tab=revise");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-[14px] text-muted-foreground font-medium animate-pulse">
      Redirecting to Library Revision Deck...
    </div>
  );
}
