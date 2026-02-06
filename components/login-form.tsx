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
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
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
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
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
                  <Button type="submit" disabled={loading}>
                    {loading ? "Signing in…" : "Login"}
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    onClick={onGitHubSignIn}
                    disabled={isSubmittingSocial}
                  >
                    {isSubmittingSocial ? "Redirecting…" : "Login with GitHub"}
                  </Button>

                  {errorMsg && (
                    <div className="text-red-600 text-sm mt-2" role="alert">
                      {errorMsg}
                    </div>
                  )}

                  <FieldDescription className="text-center">
                    Don't have an account? <a href="/signup">Sign up</a>
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
