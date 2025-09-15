
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPost } from "@/app/actions";
import type { Post } from "@/lib/data";
import Header from "@/components/layout/header";
import { PostCard } from "@/components/post-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostPage() {
  const params = useParams();
  const postId = params.postId as string;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      setIsLoading(true);
      const fetchedPost = await getPost(postId);
      setPost(fetchedPost);
      setIsLoading(false);
    };

    fetchPost();
  }, [postId]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-8 w-1/4" />
            </div>
          ) : post ? (
            <PostCard post={post} />
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <h2 className="text-2xl font-bold">Post not found</h2>
              <p>We couldn't find the post you were looking for.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
