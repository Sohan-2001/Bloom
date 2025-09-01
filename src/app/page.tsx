"use client";

import * as React from 'react';
import { PostCard } from '@/components/post-card';
import { mockPosts, mockUsers } from '@/lib/data';
import type { Post } from '@/lib/data';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiSuggestions } from '@/components/ai-suggestions';
import Header from '@/components/layout/header';

const categories = ["All", "Painting", "Photography", "Writing", "Music", "Crafts"];

export default function Home() {
  const [filteredPosts, setFilteredPosts] = React.useState<Post[]>(mockPosts);
  const [activeCategory, setActiveCategory] = React.useState("All");

  const handleFilter = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredPosts(mockPosts);
    } else {
      setFilteredPosts(mockPosts.filter(post => post.category === category));
    }
  };
  
  const currentUser = mockUsers[0];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="mb-6">
                <Tabs defaultValue="All" onValueChange={handleFilter}>
                  <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:grid-cols-6">
                    {categories.map(category => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 space-y-8">
                <AiSuggestions />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
