import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import GoogleLoginButton from "./GoogleLoginButton";
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm({ loading: externalLoading }: { loading?: boolean } = {}) {
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, loginWithGoogle, isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading, navigate]);

  async function onSubmit(data: { email: string; password: string }) {
    setLoading(true);
    setError(null);
    try {
      await login(data);
    } catch (err) {
      setError((err as { message?: string })?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleToken(idToken: string) {
    setGoogleError(null);
    try {
      await loginWithGoogle(idToken);
    } catch (err) {
      setGoogleError((err as { message?: string })?.message || "Google login failed");
    }
  }

  const loadingState = externalLoading || authLoading;

  if (loadingState) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-8">
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="m@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </a>
              </div>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          {error && (
            <Alert variant="destructive" className="mb-2">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {googleError && (
            <Alert variant="destructive" className="mb-2">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{googleError}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <GoogleLoginButton
            clientId={"976754772382-lac5kapm5l7vhf2019gqaccr3p4lhsr0.apps.googleusercontent.com"}
            onTokenReceived={handleGoogleToken}
            className="w-full flex justify-center"
          />
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
