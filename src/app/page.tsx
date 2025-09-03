
"use client";

import * as React from 'react';
import { PostCard } from '@/components/post-card';
import { mockPosts } from '@/lib/data';
import type { Post } from '@/lib/data';
import Header from '@/components/layout/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Image from 'next/image';
import { getFeaturedPosts, type FeaturedPost } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

const categories = ["All", "Painting", "Photography", "Writing", "Music", "Crafts"];

const FeaturedSection = () => {
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

  if (isLoading) {
    return (
        <section className="py-6 md:py-8">
            <h2 className="text-2xl font-headline tracking-wider mb-4">Featured</h2>
            <Skeleton className="w-full h-[250px] md:h-[350px]" />
        </section>
    );
  }
  
  if (featuredPosts.length === 0) return null;

  return (
    <section className="py-6 md:py-8">
      <h2 className="text-2xl font-headline tracking-wider mb-4">Featured</h2>
      <Carousel
        opts={{
          loop: true,
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {featuredPosts.map((post) => (
            <CarouselItem key={post.id} className="basis-full md:basis-1/2 lg:basis-1/3">
               <div className="relative aspect-video">
                 <Image
                    src={post.link}
                    alt="Featured project"
                    fill
                    className="object-cover rounded-lg"
                  />
               </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}


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
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-headline tracking-wider text-primary">Find Your Next Spark</h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">A vibrant community for artists, creators, and makers to share their work and find inspiration.</p>
          </div>
          <FeaturedSection />
          {categories.map(category => (
            <CategorySection key={category} category={category} posts={mockPosts} />
          ))}
        </div>
      </main>
    </div>
  );
}
