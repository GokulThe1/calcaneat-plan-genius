import { Home, FileText, Stethoscope, Microscope, Apple, ChefHat, Truck, Users, Settings, Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function RoleBasedSidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const getMenuItems = (): MenuItem[] => {
    if (!user) return [];

    const role = user.role;

    switch (role) {
      case 'admin':
        return [
          { title: "Dashboard", url: "/admin", icon: Users },
          { title: "Staff Monitoring", url: "/admin#staff", icon: Activity },
          { title: "Settings", url: "/admin#settings", icon: Settings },
        ];
      
      case 'consultant':
        return [
          { title: "Customers", url: "/consultant", icon: Users },
          { title: "Upload Reports", url: "/consultant#upload", icon: FileText },
          { title: "Acknowledgements", url: "/consultant#acknowledgements", icon: Activity },
        ];
      
      case 'lab_technician':
        return [
          { title: "Test Queue", url: "/lab", icon: Microscope },
          { title: "Upload Results", url: "/lab#upload", icon: FileText },
          { title: "Acknowledgements", url: "/lab#acknowledgements", icon: Activity },
        ];
      
      case 'nutritionist':
        return [
          { title: "Customers", url: "/nutritionist", icon: Apple },
          { title: "Diet Charts", url: "/nutritionist#charts", icon: FileText },
          { title: "Acknowledgements", url: "/nutritionist#acknowledgements", icon: Activity },
        ];
      
      case 'chef':
        return [
          { title: "Active Plans", url: "/chef", icon: ChefHat },
          { title: "Preparation", url: "/chef#prepare", icon: Activity },
        ];
      
      case 'delivery':
        return [
          { title: "Deliveries", url: "/delivery-panel", icon: Truck },
          { title: "GPS Tracking", url: "/delivery-panel#gps", icon: Activity },
        ];
      
      case 'customer':
      default:
        return [
          { title: "Dashboard", url: "/dashboard", icon: Home },
          { title: "Profile", url: "/profile", icon: Settings },
        ];
    }
  };

  const menuItems = getMenuItems();
  const roleLabel = user?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'User';

  return (
    <Sidebar data-testid="sidebar-role-based">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{roleLabel} Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url || location.startsWith(item.url + '#')}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
