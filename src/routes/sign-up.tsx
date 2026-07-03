import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, Field } from "./sign-in";

export const Route = createFileRoute("/sign-up")({
  head: () => ({ meta: [{ title: "Sign Up — StudyMind" }, { name: "description", content: "Create your StudyMind account." }] }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  return (
    <AuthShell
      title="Create your account"
      sub="Start building a memory-powered study practice."
      cta="Create Account"
      alt={<>Already have an account? <Link to="/sign-in" className="text-primary hover:underline">Sign in</Link></>}
      onSubmit={() => navigate({ to: "/dashboard" })}
    >
      <Field label="Full Name" type="text" placeholder="Alex Chen" />
      <Field label="Email" type="email" placeholder="you@school.edu" />
      <Field label="Password" type="password" placeholder="At least 8 characters" />
      <Field label="Confirm Password" type="password" placeholder="Re-enter password" />
    </AuthShell>
  );
}
