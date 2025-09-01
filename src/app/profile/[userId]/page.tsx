
"use client";

import { PostCard } from "@/components/post-card";
import Header from "@/components/layout/header";
import { mockPosts, mockUsers } from "@/lib/data";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  // In a real app, you'd fetch this from a database.
  // We're simulating this by finding the user in our mock data.
  // We'll also map firebase UIDs to our mock user IDs for demonstration.
  const uidMap: { [key: string]: string } = {
      // This is a placeholder. In a real app, you'd have a DB collection
      // mapping Firebase UIDs to your application's user profiles.
      // For now, let's pretend the first user's firebase UID is 'u1' for the mock data.
      // We will need to update the signup process to create this mapping.
      "Z3M4IYo3d8ZXM1S4Vv1V9gYp2Xw2": "u1",
  };
  const mockUserId = uidMap[userId] || userId;
  
  const user = mockUsers.find((u) => u.id === mockUserId);
  const userPosts = mockPosts.filter((post) => post.user.id === mockUserId);

  const getInitials = (name?: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        {user ? (
          <>
            <div className="bg-card/30">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                   <Avatar className="h-32 w-32 border-4 border-background">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-4xl">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  <div className="text-center md:text-left">
                    <h1 className="text-4xl font-headline tracking-wider">{user.name}</h1>
                    <p className="mt-2 text-lg text-muted-foreground max-w-xl">{user.bio}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h2 className="text-2xl font-headline tracking-wider mb-6">Projects</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
               {userPosts.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>{user.name} hasn't posted any projects yet.</p>
                </div>
                )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <h2 className="text-2xl font-bold">User not found</h2>
            <p className="text-muted-foreground">
              We couldn't find a profile for this user.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

