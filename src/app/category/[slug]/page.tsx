
"use client";

import { PostCard } from "@/components/post-card";
import Header from "@/components/layout/header";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPosts } from "@/app/actions";
import type { Post } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const category = slug.charAt(0).toUpperCase() + slug.slice(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const allPosts = await getPosts();
      const filtered = category === "All"
        ? allPosts
        : allPosts.filter(
            (post) => post.category.toLowerCase() === category.toLowerCase()
          );
      setPosts(filtered);
      setIsLoading(false);
    };

    fetchPosts();
  }, [category]);


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8 pt-20 sm:pt-22 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl sm:text-4xl font-headline tracking-wider mb-8">{category}</h1>
           {isLoading ? (
             <div className="space-y-6">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
           ) : posts.length > 0 ? (
            <div className="flex flex-col gap-8">
                {posts.map((post) => (
                <PostCard key={post.id} post={post} />
                ))}
            </div>
           ) : (
            <div className="text-center py-16 text-muted-foreground">
                <p>No projects found in this category yet.</p>
            </div>
           )
           }
        </div>
      </main>
    </div>
  );
}
