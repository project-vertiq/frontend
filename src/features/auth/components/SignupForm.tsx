import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import GoogleLoginButton from "./GoogleLoginButton";
import { useAuth } from '@/contexts/AuthContext';
import { signup } from '@/services/auth.api';
import type { SignupRequest } from '@/types';
import { Skeleton } from "@/components/ui/skeleton";

// Define a type that matches the Zod schema (date_of_birth as Date | null)
type SignupFormValues = Omit<SignupRequest, 'date_of_birth'> & { date_of_birth: Date | null };

const SignupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  mobile_number: z.string().min(1, "Mobile number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  date_of_birth: z.date({ required_error: "Date of birth is required" }).nullable(),
});

export default function SignupForm() {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      mobile_number: '',
      password: '',
      gender: undefined,
      date_of_birth: null,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  async function onSubmit(data: SignupFormValues) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Convert date_of_birth to string (YYYY-MM-DD)
      const dob = data.date_of_birth ? data.date_of_birth.toISOString().split('T')[0] : '';
      await signup({ ...data, date_of_birth: dob });
      await login({ email: data.email, password: data.password });
      setSuccess(true);
      navigate('/dashboard');
    } catch (err) {
      setError((err as { message?: string })?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleToken(idToken: string) {
    setGoogleError(null);
    try {
      await loginWithGoogle(idToken);
      setSuccess(true);
    } catch (err) {
      setGoogleError((err as { message?: string })?.message || "Google signup failed");
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded" />
        ))}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your details below to sign up
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <FormField control={form.control} name="first_name" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>First Name</FormLabel>
              <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="last_name" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Last Name</FormLabel>
              <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="mobile_number" render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile Number</FormLabel>
            <FormControl><Input {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl><Input type="password" {...field} value={typeof field.value === 'string' ? field.value : ''} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex flex-col sm:flex-row gap-2">
          <FormField control={form.control} name="gender" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} value={typeof field.value === 'string' ? field.value : undefined}>
                <FormControl>
                  <SelectTrigger className="w-full min-w-0">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="date_of_birth" render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value as Date, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value instanceof Date ? field.value : undefined}
                    onSelect={field.onChange}
                    disabled={date => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        {error && (
          <Alert variant="destructive" className="mb-2">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && <div className="text-green-600 text-sm">Signup successful!</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        {googleError && (
          <Alert variant="destructive" className="mb-2">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{googleError}</AlertDescription>
          </Alert>
        )}
        <GoogleLoginButton
          clientId={"976754772382-lac5kapm5l7vhf2019gqaccr3p4lhsr0.apps.googleusercontent.com"}
          onTokenReceived={handleGoogleToken}
          className="w-full flex justify-center"
        />
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="underline underline-offset-4">Login</Link>
        </div>
      </form>
    </Form>
  );
}
