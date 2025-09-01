
import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="flex justify-center items-center space-x-2">
            <span className="font-headline text-5xl font-bold text-primary tracking-wider">
              BLOOM
            </span>
          </Link>
          <p className="text-muted-foreground mt-2">
            Welcome back! Sign in to continue.
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
