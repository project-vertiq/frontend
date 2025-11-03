import { GalleryVerticalEnd } from "lucide-react";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 w-full">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Vertiq Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-black lg:block">
        <img
          src={"/public/assets/vertical_logo_white.svg"}
          alt="Vertiq Logo"
          className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 object-contain p-0 dark:brightness-[0.9]"
        />
      </div>
    </div>
  );
}
