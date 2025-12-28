import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import React from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/reducer/authReducer'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoutes'

const LogoutButton = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const handleLogout = async () => {
        try {
            const response = await axios.post("/api/auth/logout");
            if (response.status === 200) {
                router.push(WEBSITE_LOGIN);
            }
            dispatch(logout());
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <DropdownMenuItem onClick={handleLogout}>
            <div className="cursor-pointer   flex items-center gap-2" >
                <AiOutlineLogout color='red' /> Logout</div>
        </DropdownMenuItem>
    )
}

export default LogoutButton