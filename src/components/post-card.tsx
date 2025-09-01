"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Post } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden transition-transform hover:scale-105 duration-300 border-none bg-card group">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4]">
          <Image
            src={post.image}
            alt={post.caption}
            fill
            data-ai-hint={post.imageHint}
            className="object-cover"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
           <div className="absolute bottom-0 left-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <p className="text-white font-semibold text-sm">{post.user.name}</p>
             <p className="text-white/80 text-xs">{post.caption.length > 50 ? post.caption.substring(0, 50) + '...' : post.caption}</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
