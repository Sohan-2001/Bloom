
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
import { getFeaturedPosts, type FeaturedPost } from '@/lib/posts';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [featuredPosts, setFeaturedPosts] = React.useState<FeaturedPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const posts = await getFeaturedPosts();
      setFeaturedPosts(posts);
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="relative h-[50vh] w-full mb-8">
          {isLoading ? (
             <Skeleton className="h-full w-full" />
           ) : (
            featuredPosts.length > 0 && (
              <Carousel className="w-full h-full" opts={{ loop: true, align: "start" }}>
                <CarouselContent className="h-full">
                  {featuredPosts.map((post) => (
                    <CarouselItem key={post.id} className="h-full">
                      <div className="relative h-full w-full">
                        <Image
                          src={post.link}
                          alt="Featured post"
                          fill
                          data-ai-hint="featured project"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )
           )}
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
