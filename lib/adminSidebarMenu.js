// Admin Sidebar icons.
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_MEDIA_SHOW,
} from "@/routes/AdminPanelRoutes";

export const adminAppSidebarMenu = [
  {
    title: "Dashboard",
    url: ADMIN_DASHBOARD,
    icon: AiOutlineDashboard, // ✔ remove JSX
  },
  {
    title: "Categories",
    url: "#",
    icon: BiCategory,
    subMenu: [
      { title: "All Categories", url: ADMIN_CATEGORY_SHOW },
      { title: "Add Category", url: ADMIN_CATEGORY_ADD },
    ],
  },
  {
    title: "Products",
    url: "#",
    icon: IoShirtOutline,
    subMenu: [
      { title: "All Products", url: "#" },
      { title: "Add Product", url: "#" },
      { title: "Add Variant", url: "#" },
      { title: "Product Variants", url: "#" },
    ],
  },
  {
    title: "Coupons",
    url: "#",
    icon: RiCoupon2Line,
    subMenu: [
      { title: "All Coupons", url: "#" },
      { title: "Add Coupon", url: "#" },
    ],
  },
  {
    title: "Orders",
    url: "#",
    icon: MdOutlineShoppingBag,
  },
  {
    title: "Customers",
    url: "#",
    icon: LuUserRound,
  },
  {
    title: "Reviews",
    url: "#",
    icon: IoMdStarOutline,
  },
  {
    title: "Media",
    url: ADMIN_MEDIA_SHOW,
    icon: MdOutlinePermMedia,
  },
];
