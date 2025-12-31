'use client'
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import React from "react";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
const AppSidebar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar className={"z-50"}>
      <SidebarHeader className={"border-b h-14 p-0"}>
        <div className="flex justify-between items-center my-auto px-4">
          {/* TODO: Add company logo   */}
          {/* <Image
           src={logoBlack}
           height={50}
           className='block dark:hidden'
           alt='logo dark'
          />
          <Image
           src={logolight}
           height={50}
           className='hidden dark:block'
           alt='logo dark'
          /> */}
          Ajay Upadhyay
          <Button onClick={toggleSidebar} type="button" size={"icon"} className="md:hidden">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3 ">
        <SidebarMenu>
          {adminAppSidebarMenu.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Link href={menu?.url}>
                      <menu.icon />
                      {menu.title}
                      {menu?.subMenu && menu.subMenu.length > 0 && (
                        <LuChevronRight className="ml-auto transition-transform duration-200 group-data[state=open]/collapsible:rotate-90 " />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {menu?.subMenu && menu.subMenu.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub className="pl-6">
                      {menu.subMenu.map((subMenu, subIndex) => (
                        <SidebarMenuSubItem key={subIndex}>
                          <SidebarMenuButton asChild>
                            <Link href={subMenu.url}>{subMenu.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
