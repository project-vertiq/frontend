"use client"

import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="relative flex size-9 shrink-0 overflow-hidden rounded-full cursor-pointer">
          <Avatar className="size-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md min-w-60 w-[var(--radix-dropdown-menu-trigger-width)]">
        <DropdownMenuLabel className="text-sm font-medium p-0">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border -mx-1 my-1 h-px" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none">
            <Sparkles />Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border -mx-1 my-1 h-px" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none">
            <BadgeCheck />Account
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none">
            <CreditCard />Billing
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none">
            <Bell />Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border -mx-1 my-1 h-px" />
        <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none">
          <LogOut />Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
