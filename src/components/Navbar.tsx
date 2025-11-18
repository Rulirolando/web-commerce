import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";
import DesktopNavbar from "./DesktopNavbar";

export default async function Navbar() {
  const user = await currentUser();

  if (user) {
    await syncUser();
  }

  return (
    <div className="fixed w-full h-14 bg-[#0B1D51] dark:bg-transparent dark:border-b dark:border-gray-800 z-50">
      <div className="flex items-center justify-between mx-4 h-full">
        <div className=" text-2xl font-bold">
          <Link href="/" className="text-white dark:text-white">
            Shop
          </Link>
        </div>
        <DesktopNavbar />
      </div>
    </div>
  );
}
