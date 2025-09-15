
"use client";

import { LogOut, Menu, Plus, User as UserIcon, Moon, Sun, Monitor, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import * as React from 'react';
import { UploadPostDialog } from '../upload-post-dialog';
import { useTheme } from "next-themes";
import { FeedbackDialog } from "../feedback-dialog";

const categories = [
  "All",
  "Painting",
  "Photography",
  "Writing",
  "Music",
  "Crafts",
];

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = React.useState(false);
  const { setTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <>
    <UploadPostDialog open={isUploadDialogOpen} setOpen={setIsUploadDialogOpen} />
    <FeedbackDialog open={isFeedbackDialogOpen} setOpen={setIsFeedbackDialogOpen} />
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-primary/80 text-secondary backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-2 flex items-center space-x-2 sm:mr-4">
            <span className="hidden sm:inline font-headline text-2xl font-bold tracking-wider sm:text-3xl">
              BLOOM
            </span>
          </Link>
          <Button 
            size="sm" 
            onClick={() => setIsUploadDialogOpen(true)}
            className="sm:hidden bg-secondary text-secondary-foreground hover:bg-secondary/90 ring-1 ring-yellow-400"
          >
            <Plus className="mr-2 h-4 w-4" />
            Post
          </Button>
          <Button 
            size="sm" 
            onClick={() => setIsUploadDialogOpen(true)}
            className="hidden sm:inline-flex bg-secondary text-secondary-foreground hover:bg-secondary/90 ring-1 ring-yellow-400"
          >
            <Plus className="mr-2 h-4 w-4" />
            Post
          </Button>
          <nav className="hidden items-center space-x-2 text-sm font-medium md:flex ml-4 lg:space-x-6 lg:ml-6">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="transition-colors hover:text-secondary/80"
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hover:bg-primary/90" onClick={() => setIsFeedbackDialogOpen(true)}>
                <MessageSquareText className="mr-2 h-4 w-4" />
                Feedback
            </Button>
          </div>

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-primary/90">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.uid}`}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
                        <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <Sun className="mr-2 h-4 w-4" />
                                <span>Light</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <Moon className="mr-2 h-4 w-4" />
                                <span>Dark</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                <Monitor className="mr-2 h-4 w-4" />
                                <span>System</span>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              variant="ghost"
              asChild
              className="hover:bg-primary/90 text-sm sm:text-base"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-primary/90"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
               <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through the application.
                </SheetDescription>
              </SheetHeader>
               <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-headline text-3xl font-bold text-primary tracking-wider">
                  BLOOM
                </span>
              </Link>
              <div className="mt-4 flex flex-col space-y-2">
                 <Button 
                    size="sm" 
                    onClick={() => {
                        const sheetClose = document.querySelector('[data-radix-dialog-close]');
                        if (sheetClose instanceof HTMLElement) {
                            sheetClose.click();
                        }
                        setIsUploadDialogOpen(true);
                    }}
                    className="sm:hidden bg-secondary text-secondary-foreground hover:bg-secondary/90 ring-1 ring-yellow-400"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Post
                </Button>
                <Button className="w-full justify-start" variant="ghost" size="sm" onClick={() => {
                     const sheetClose = document.querySelector('[data-radix-dialog-close]');
                        if (sheetClose instanceof HTMLElement) {
                            sheetClose.click();
                        }
                    setIsFeedbackDialogOpen(true)
                }}>
                    <MessageSquareText className="mr-2 h-4 w-4" />
                    Feedback
                </Button>
              </div>
              <nav className="mt-4 flex flex-col space-y-4 text-lg font-medium">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase()}`}
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                  >
                    {category}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
