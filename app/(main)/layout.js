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
          <div className="flex items-center gap-2 p-3 sm:p-4 border-b bg-white">
            <SidebarTrigger>
              <Button variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-9">
                <Menu className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </SidebarTrigger>
            <div className="flex-1">
              <h1 className="text-sm sm:text-base font-medium text-gray-700 hidden sm:block">Dashboard</h1>
            </div>
          </div>
          <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

export default DashboardLayout;
