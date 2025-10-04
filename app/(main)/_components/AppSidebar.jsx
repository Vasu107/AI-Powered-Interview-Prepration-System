"use client"
import Image from "next/image"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SideBarOptions } from "@/services/Constants"
import { usePathname } from "next/navigation"
 
export function AppSidebar() {
  const path = usePathname();
  
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center mt-5">
        <Image 
          src="/logo.png" 
          alt="logo" 
          width={200}
          height={100}
          className="w-[150px]"
        />
        <Button asChild className="w-full mt-5">
          <Link href="/dashboard/create-interview">
            <Plus className="mr-2 h-4 w-4" /> 
            Create New Interview
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton 
                  asChild 
                  isActive={path === option.path}
                  className="p-3"
                >
                  <Link href={option.path}>
                    <option.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{option.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}