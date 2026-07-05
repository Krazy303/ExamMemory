import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/settings")({
  component: SettingsRedirect,
});

function SettingsRedirect() {
  useEffect(() => {
    window.location.replace("/dashboard?tab=settings");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-[14px] text-muted-foreground font-medium animate-pulse">
      Redirecting to My Dashboard settings...
    </div>
  );
}
