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
        "z-50 bg-background fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {isLoading && (
          <p>
            <Spinner />
          </p>
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size={"sm"}>Get Fumez free</Button>
            </SignInButton>
          </>
        )}
        <div></div>
        {isAuthenticated && !isLoading && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/materials">Enter Fumez</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
            <ModeToggle />
          </div>
        )}
      </div>
    </div>
  );
};
