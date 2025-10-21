"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const NavBar = () => {
  const { isLoggedIn, handleLogout, openLoginModal, openRegisterModal } = useAuth();

  return (
    <nav className="w-full border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex space-x-8">
        <Link href="/">
          <Button className="text-sm font-medium">
            Stock
          </Button>
        </Link>
        <Link href="/watchlist">
          <Button variant="outline" className="text-sm font-medium">
            Watchlist
          </Button>
        </Link>
        <Link href="/wallets">
          <Button variant="outline" className="text-sm font-medium">
            My Wallets
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" className="text-sm font-medium">
            Contact
          </Button>
        </Link>
      </div>
      <div className="flex space-x-4">
        {isLoggedIn ? (
          <Button className="text-sm" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button variant="outline" className="text-sm" onClick={openRegisterModal}>
              Register
            </Button>
            <Button className="text-sm" onClick={openLoginModal}>
              Log in
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
