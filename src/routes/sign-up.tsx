import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, Field } from "./sign-in";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "Sign Up — StudyMemo" },
      { name: "description", content: "Create your StudyMemo account." },
    ],
  }),
  component: SignUp,
});

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

function SignUp() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!email || !name) {
      setError("Name and Email are required");
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      await signIn(email, name);
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      setError(e.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      sub="Start building a memory-powered study practice."
      cta={loading ? "Creating Account..." : "Create Account"}
      alt={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
      onSubmit={handleSignUp}
    >
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
      <Field 
        label="Full Name" 
        type="text" 
        placeholder="Alex Chen" 
        value={name}
        onChange={(e: any) => setName(e.target.value)}
        required
      />
      <Field 
        label="Email" 
        type="email" 
        placeholder="you@school.edu" 
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
        required
      />
      <Field
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
        required
      />
      <Field
        label="Confirm Password"
        type="password"
        placeholder="Re-enter password"
        value={confirmPassword}
        onChange={(e: any) => setConfirmPassword(e.target.value)}
        required
      />
    </AuthShell>
  );
}
