"use client"
import React from 'react'
import { AppSidebar } from "./_components/AppSidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProtectedRoute from '@/components/ProtectedRoute'

function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center gap-2 p-4 border-b">
            <SidebarTrigger>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SidebarTrigger>
          </div>
          <div className="p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

export default DashboardLayout;
