"use client";

import * as React from 'react';
import { PostCard } from '@/components/post-card';
import { mockPosts, mockUsers } from '@/lib/data';
import type { Post } from '@/lib/data';
import Header from '@/components/layout/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Image from 'next/image';

const categories = ["All", "Painting", "Photography", "Writing", "Music", "Crafts"];

const CategorySection = ({ category, posts }: { category: string, posts: Post[] }) => {
  const filteredPosts = category === "All" ? posts : posts.filter(post => post.category === category);
  
  if(filteredPosts.length === 0) return null;

  return (
    <section className="py-6 md:py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-headline tracking-wider">{category === "All" ? "Popular" : category}</h2>
        <Button variant="link" asChild>
          <Link href={`/category/${category.toLowerCase()}`}>
            See All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {filteredPosts.map((post) => (
            <CarouselItem key={post.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
               <PostCard post={post} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};


export default function Home() {
  const featuredPosts = mockPosts.slice(0, 5);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="relative h-[50vh] w-full mb-8">
           <Carousel className="w-full h-full" opts={{ loop: true }}>
            <CarouselContent className="h-full">
              {featuredPosts.map((post, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="relative h-full w-full">
                    <Image
                      src={post.image}
                      alt={post.caption}
                      fill
                      data-ai-hint={post.imageHint}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                     <div className="absolute bottom-10 left-10 text-white">
                        <h2 className="text-4xl font-headline tracking-wider">{post.user.name}'s Project</h2>
                        <p className="max-w-lg mt-2 text-lg">{post.caption}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map(category => (
            <CategorySection key={category} category={category} posts={mockPosts} />
          ))}
        </div>
      </main>
    </div>
  );
}
