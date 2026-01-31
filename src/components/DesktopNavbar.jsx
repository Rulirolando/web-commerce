import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdOutlineShoppingCart } from "react-icons/md";
import { currentUser } from "@clerk/nextjs/server";
import { SignedIn, UserButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";

const DesktopNavbar = async () => {
  const user = await currentUser();
  return (
    <div className="flex items-center space-x-8">
      <ModeToggle />
      {user && (
        <div className="flex items-center space-x-4">
          <Button className="bg-transparent hover:bg-[#3674B5] border-none dark:hover:bg-transparent">
            <Link href="/cart" className="text-white">
              <MdOutlineShoppingCart />
            </Link>
          </Button>
          <Button className="bg-transparent hover:bg-[#3674B5] border-none dark:hover:bg-transparent">
            <Link
              href={`/jual/${user.username || user.id}`}
              className="text-white"
            >
              Jual
            </Link>
          </Button>
          <Button className="bg-transparent hover:bg-[#3674B5] border-none dark:hover:bg-transparent">
            <Link
              href={`/profile/${user.username || user.id}`}
              className="text-white"
            >
              Profile
            </Link>
          </Button>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      )}
    </div>
  );
};

export default DesktopNavbar;
