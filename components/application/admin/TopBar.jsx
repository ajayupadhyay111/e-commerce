"use client"
import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { RiMenu4Fill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const TopBar = () => {
  const { toggleSidebar } = useSidebar();
  return <div className="fixed h-14 px-5 w-full top-0 left-0 z-30 md:ps-72 md:pe-10 border flex justify-between items-center dark:bg-card bg-white">
    <div>Search component</div>
    <div className="flex items-center gap-5">
      <ThemeSwitch />
      <UserDropdown />
      <Button type="button" size="icon" className="ms-2 md:hidden" onClick={toggleSidebar}>
        <RiMenu4Fill />
      </Button>
    </div>
  </div>;
};

export default TopBar;
