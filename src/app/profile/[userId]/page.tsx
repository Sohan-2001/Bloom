
"use client";

import { PostCard } from "@/components/post-card";
import Header from "@/components/layout/header";
import { mockPosts, mockUsers, type User } from "@/lib/data";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      setIsLoading(true);
      
      // First, try to find user in mock data for existing demo users
      const mockUser = mockUsers.find(u => u.id === userId);
      if (mockUser) {
        setUser(mockUser);
        setIsLoading(false);
        return;
      }
      
      // If not in mock data, fetch from Firestore
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUser({
            id: data.uid,
            name: data.displayName,
            avatar: data.photoURL,
            bio: data.bio,
          });
        } else {
          // Fallback for the initial demo user u1 if a real user with that ID is not found.
          const uidMap: { [key: string]: string } = {
             "Z3M4IYo3d8ZXM1S4Vv1V9gYp2Xw2": "u1",
          };
          const mockUserId = uidMap[userId];
          const foundUser = mockUsers.find((u) => u.id === mockUserId);
          setUser(foundUser || null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);


  // For now, we'll continue to use mock posts.
  // In a real app, you would fetch posts created by this user.
  const userPosts = mockPosts.filter((post) => post.user.id === user?.id);

  const getInitials = (name?: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  if (isLoading) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1">
                 <div className="bg-card/30">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
                            <div className="space-y-2 text-center md:text-left">
                                <Skeleton className="h-10 w-64" />
                                <Skeleton className="h-6 w-96" />
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h2 className="text-2xl font-headline tracking-wider mb-6">Projects</h2>
                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="aspect-[3/4] w-full" />)}
                    </div>
                </div>
            </main>
        </div>
    )
  }

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

