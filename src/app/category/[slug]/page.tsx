"use client";

import { PostCard } from "@/components/post-card";
import Header from "@/components/layout/header";
import { mockPosts } from "@/lib/data";
import { useParams } from "next/navigation";
import { mockUsers } from "@/lib/data";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = slug.charAt(0).toUpperCase() + slug.slice(1);

  const filteredPosts = category === "All"
    ? mockPosts
    : mockPosts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-headline tracking-wider mb-8">{category}</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
