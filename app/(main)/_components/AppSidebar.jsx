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
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="flex items-center mt-3 sm:mt-4 lg:mt-5 px-3 sm:px-4">
        <div className="w-full flex justify-center mb-3 sm:mb-4">
          <Image 
            src="/logo.svg" 
            alt="logo" 
            width={10}
            height={10}
            className="w-[50px] sm:w-[50px] lg:w-[50px] h-auto"
          />
        </div>
        <Button asChild className="w-full h-9 sm:h-10 lg:h-11 text-xs sm:text-sm">
          <Link href="/dashboard/create-interview">
            <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
            <span className="hidden sm:inline">Create New Interview</span>
            <span className="sm:hidden">Create</span>
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent className="px-2 sm:px-3">
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton 
                  asChild 
                  isActive={path === option.path}
                  className="p-2 sm:p-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Link href={option.path}>
                    <option.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium truncate">{option.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 sm:p-3">
        <div className="text-xs text-gray-500 text-center">
          <p>&copy; 2024 AskUp</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}