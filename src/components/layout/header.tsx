
"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const categories = ["All", "Painting", "Photography", "Writing", "Music", "Crafts"];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-black/90 to-transparent transition-all">
      <div className="container flex h-20 items-center">
        <div className="mr-8 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-headline text-3xl font-bold text-primary tracking-wider">
              BLOOM
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
             {categories.map(category => (
                <Link key={category} href={`/category/${category.toLowerCase()}`} className="text-white hover:text-white/80 transition-colors">
                    {category}
                </Link>
             ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" asChild className="text-white hover:text-white/80">
                <Link href="/sign-in">Sign In</Link>
            </Button>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-white/80">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="flex flex-col space-y-4 text-lg font-medium mt-8">
                        {categories.map(category => (
                            <Link key={category} href={`/category/${category.toLowerCase()}`} className="text-white hover:text-white/80 transition-colors">
                                {category}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
