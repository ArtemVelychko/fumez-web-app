"use client";

import { useConvexAuth } from "convex/react";
import { UserButton, SignInButton } from "@clerk/clerk-react";
import Link from "next/link";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-x-2">
          {isLoading && <Spinner />}
          {!isAuthenticated && !isLoading && (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button size="sm">Sign up</Button>
              </SignInButton>
            </>
          )}
          {isAuthenticated && !isLoading && (
              <UserButton afterSignOutUrl="/" />
          )}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
