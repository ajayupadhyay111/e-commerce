import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSelector } from 'react-redux'
import { IoShirtOutline } from 'react-icons/io5'
import Link from 'next/link'
import { MdOutlineShoppingBag } from 'react-icons/md'
import LogoutButton from './LogoutButton'

const UserDropdown = () => {
    const auth = useSelector((state) => state.authStore.auth)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* TODO: you can change this default image url */}
                <Avatar className={"rounded-full"}>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"me-5 w-44"}>
                <DropdownMenuLabel>
                    <p className='font-semibold'>{auth?.name}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href='/admin/profile' className="cursor-pointer flex items-center gap-2"><IoShirtOutline /> New Product</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href='/admin/profile' className="cursor-pointer flex items-center gap-2"><MdOutlineShoppingBag /> Orders</Link>
                </DropdownMenuItem>
                <LogoutButton />
            </DropdownMenuContent>
        </DropdownMenu >
    )
}

export default UserDropdown