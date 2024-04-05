"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import UserMenu from "./userMenu";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <div className="container flex flex-row items-center  justify-between  py-4 sm:flex-row sm:space-y-0 md:h-16">
      <h2 className="text-lg font-semibold">SP11 Music Generator App</h2>

      {/* toggle between sign in button and sign out button based on user status */}
      {user ? (
        <UserMenu />
      ) : (
        <Link href="/signin">
          <Button variant="outline">Sign In</Button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
