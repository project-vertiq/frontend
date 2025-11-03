import onlyLogoWhite from "/assets/only_logo_white.svg";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { Frame, PieChart, SquareTerminal, Wallet, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * DashboardSidebar wraps the shadcn sidebar and adds a floating trigger button.
 */
// Custom data for dashboard sidebar
const dashboardSidebarData = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: SquareTerminal, isActive: true },
    { title: "Reports", url: "/reports", icon: PieChart },
    { title: "Wallet", url: "/wallet", icon: Wallet },
  ],
  navProfile: [
    { title: "Users", url: "/users", icon: Users },
    { title: "Brokers", url: "/brokers", icon: Frame },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
};

export function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-2">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg transition-all duration-200">
                  <img src={onlyLogoWhite} alt="Logo" className="size-7" />
                </div>
                <div className="flex flex-col justify-center gap-0 leading-tight transition-all duration-200 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:ml-0 overflow-hidden h-8">
                  <span className="font-bold text-xl tracking-[0.25em] text-sidebar-foreground drop-shadow-sm leading-[1.1]">VERTIQ</span>
                  {/* <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sidebar-primary/80 leading-[1.1]">Apex of Investments</span> */}
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dashboardSidebarData.navMain} />
        <SidebarGroup>
          <SidebarGroupLabel>Profile</SidebarGroupLabel>
          <SidebarMenu>
            {dashboardSidebarData.navProfile.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
