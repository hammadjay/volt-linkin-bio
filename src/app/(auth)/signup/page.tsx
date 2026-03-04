"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  function validateUsername(value: string) {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setUsername(cleaned);

    if (cleaned.length < 3) {
      setUsernameError("Username must be at least 3 characters");
    } else if (cleaned.length > 30) {
      setUsernameError("Username must be 30 characters or less");
    } else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(cleaned)) {
      setUsernameError("Must start and end with a letter or number");
    } else {
      setUsernameError("");
    }
  }

  async function checkUsername(username: string): Promise<boolean> {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();
    return !data;
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (usernameError) return;
    setLoading(true);

    const available = await checkUsername(username);
    if (!available) {
      toast.error("Username is already taken");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName || username,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Account created! Redirecting...");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold">
            <Zap className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            <span>Volt</span>
          </Link>
          <p className="mt-2 text-muted-foreground">Create your Volt page in seconds.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center gap-0">
              <span className="flex h-9 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                volt.app/
              </span>
              <Input
                id="username"
                type="text"
                placeholder="yourname"
                className="rounded-l-none"
                value={username}
                onChange={(e) => validateUsername(e.target.value)}
                required
              />
            </div>
            {usernameError && (
              <p className="text-sm text-destructive">{usernameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Your Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !!usernameError}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
