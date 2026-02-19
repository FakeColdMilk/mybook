// components/login-form.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { authClient } from "@/src/lib/auth-client";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmittingSocial, setIsSubmittingSocial] = useState(false);

  // redirect if already signed in
  const sessionHook = authClient.useSession();
  useEffect(() => {
    if (sessionHook.data) {
      router.replace("/");
    }
  }, [sessionHook.data, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        setErrorMsg(error.message || "Login failed");
        return;
      }

      // success: navigate to dashboard (change to your route)
      router.push("/");
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "Unexpected error");
    }
  }

  async function onGitHubSignIn() {
    setIsSubmittingSocial(true);
    setErrorMsg(null);
    try {
      // starts redirect to GitHub OAuth provider
      await authClient.signIn.social({
        provider: "github",
      });
    } catch (err: any) {
      setErrorMsg(err?.message || "GitHub sign-in failed");
    } finally {
      setIsSubmittingSocial(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-slate-800 border-4 border-amber-400">
        <CardHeader>
          <CardTitle className="text-3xl font-black text-white">Login to your account</CardTitle>
          <CardDescription className="text-base text-slate-300">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-white font-semibold">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-white font-semibold">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm text-amber-400 hover:text-amber-300 underline-offset-4 hover:underline font-semibold"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              <Field>
                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white font-black text-base">
                    {loading ? "Signing in…" : "Login"}
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    onClick={onGitHubSignIn}
                    disabled={isSubmittingSocial}
                    className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900 font-black text-base"
                  >
                    {isSubmittingSocial ? "Redirecting…" : "Login with GitHub"}
                  </Button>

                  {errorMsg && (
                    <div className="text-amber-400 text-sm mt-2 font-bold" role="alert">
                      {errorMsg}
                    </div>
                  )}

                  <FieldDescription className="text-center text-slate-300">
                    Don't have an account? <a href="/signup" className="text-amber-400 font-bold hover:text-amber-300">Sign up</a>
                  </FieldDescription>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
