import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { NavUser } from "@/components/nav-user";

const user = {
  name: "Your Name",
  email: "your@email.com",
  avatar: "/avatars/your-avatar.jpg",
};

export function SiteHeader({ title = "Dashboard" }: { title?: string }) {
  return (
    <div className="sticky top-0 z-50 flex flex-col">
      <header className="bg-background/50 flex h-14 items-center gap-3 w-full backdrop-blur-xl lg:h-[60px] px-0">
        {/* Sidebar trigger and Dashboard title left-aligned */}
        <div className="flex items-center gap-2 min-w-0">
          <SidebarTrigger className="size-9 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50" />
          <h1 className="text-lg font-semibold truncate ml-2">{title}</h1>
        </div>
        <div className="flex-1" />
        {/* Notification bell */}
        <Button variant="outline" size="icon" className="size-9 relative">
          <Bell className="animate-tada" />
          <span className="bg-destructive absolute -end-0.5 -top-0.5 block size-2 shrink-0 rounded-full" />
        </Button>
        {/* Profile dropdown (shadcn NavUser) */}
        <div className="ml-2">
          <NavUser user={user} />
        </div>
      </header>
    </div>
  );
}

// Example usage of Link component for client-side navigation
// <Link to="/dashboard">Dashboard</Link>
// <Link to="/brokers">Brokers</Link>
