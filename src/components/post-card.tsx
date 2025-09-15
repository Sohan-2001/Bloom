
"use client";

import * as React from 'react';
import type { Post } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { MessageCircle, Heart } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface PostCardProps {
  post: Post;
}

const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const formatDate = (timestamp: Post['createdAt']) => {
    if (!timestamp) return 'Just now';
    const date = new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
    // format as "Month Day, Year"
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="flex flex-col h-full border-none shadow-md hover:shadow-xl transition-shadow duration-300 w-full">
       <CardHeader className="p-4">
        <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
            </Avatar>
            <div>
                 <Link href={`/profile/${post.user.id}`} className="font-semibold text-sm hover:underline">
                    {post.user.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                    {formatDate(post.createdAt)}
                </p>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <p className="text-foreground leading-relaxed">{post.caption}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
         <div className="flex space-x-4 text-muted-foreground">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments.length}</span>
            </Button>
         </div>
         <span className="text-xs text-muted-foreground">{post.category}</span>
      </CardFooter>
    </Card>
  );
}
