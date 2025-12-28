import AppSidebar from "@/components/application/admin/AppSidebar";
import ThemeProvider from "@/components/application/admin/Theme-Provider";
import TopBar from "@/components/application/admin/TopBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <main className="md:w-[calc(100vw-16rem)]">
          <div className="pt-[70px] px-8 min-h-[calc(100vh-40px)] pb-10">
            <TopBar />
            {children}
          </div>

          {/* TODO: change this footer based on client requirement */}
          <div className="border-t h-10 flex justify-center items-center bg-gray-50 dark:bg-background  text-sm">
            Developed by Ajay Upadhyay
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default layout;
