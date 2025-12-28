'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const ThemeSwitch = () => {
    const { setTheme } = useTheme();
    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className={"cursor-pointer"} >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:hidden" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 hidden dark:block" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"cursor-pointer"}>
                <DropdownMenuLabel onClick={() => setTheme('light')}>Light</DropdownMenuLabel>
                <DropdownMenuLabel onClick={() => setTheme('dark')}>Dark</DropdownMenuLabel>
                <DropdownMenuLabel onClick={() => setTheme('system')}>System</DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeSwitch