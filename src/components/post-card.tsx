"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Post } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src={post.user.avatar} alt={post.user.name} />
          <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <p className="font-semibold">{post.user.name}</p>
          <p className="text-xs text-muted-foreground">@{post.user.name.toLowerCase()}</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-w-4 aspect-h-3">
          <Image
            src={post.image}
            alt={post.caption}
            width={600}
            height={400}
            data-ai-hint={post.imageHint}
            className="object-cover"
          />
        </div>
        <div className="p-4 space-y-3">
            <Badge variant="secondary">{post.category}</Badge>
            <p className="text-sm">{post.caption}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex space-x-4 text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center gap-1.5 px-2">
            <Heart className={cn("h-4 w-4", isLiked && "fill-destructive text-destructive")} />
            <span className='font-normal'>{likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 px-2">
            <MessageCircle className="h-4 w-4" />
            <span className='font-normal'>{post.comments.length}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
