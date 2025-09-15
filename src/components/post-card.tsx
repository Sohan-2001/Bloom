
"use client";

import * as React from 'react';
import type { Post, Comment, User } from '@/lib/data';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { MessageCircle, Heart, Send, MoreHorizontal, Trash2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { addComment, likePost, deletePost } from '@/app/actions';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { usePathname, useRouter } from 'next/navigation';

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
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

const CommentSection = ({ comments, postId, category, profileUserId }: { comments: Comment[], postId: string, category: string, profileUserId: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in to comment.", variant: "destructive" });
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const result = await addComment(postId, user.uid, commentText, category, profileUserId);
    if (result.success) {
      setCommentText("");
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="pt-4 space-y-4">
      <Separator />
       {user && (
         <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL ?? ""} />
                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <Input 
                placeholder="Add a comment..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting}
            />
            <Button type="submit" size="icon" variant="ghost" disabled={isSubmitting || !commentText.trim()}>
                <Send className="h-4 w-4" />
            </Button>
         </form>
       )}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-3">
             <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.avatar} />
                <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
                <Link href={`/profile/${comment.user.id}`} className="font-semibold hover:underline">{comment.user.name}</Link>
                <span className="ml-2 text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  
  const [optimisticLikes, setOptimisticLikes] = React.useState(post.likes);
  const [isLiked, setIsLiked] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const isPostPage = pathname.startsWith('/post/');
  const isHomePage = pathname === '/';

  React.useEffect(() => {
    if (isPostPage) {
        setShowComments(true);
    }
  }, [isPostPage])


  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like a post.",
        variant: "destructive",
      });
      return;
    }

    if(isLiked) return; // Prevent multiple likes

    setIsLiked(true);
    setOptimisticLikes(prev => prev + 1);

    const result = await likePost(post.id);

    if (!result.success) {
      setOptimisticLikes(prev => prev - 1);
      setIsLiked(false);
      toast({
        title: "Error",
        description: "Could not like the post.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletePost(post.id, post.category, post.user.id);
    setIsDeleting(false);

    if (result.success) {
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not delete the post.",
        variant: "destructive",
      });
    }
  };

  const toggleComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isPostPage) {
        setShowComments(!showComments);
    }
  }

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // a bit of a hack to prevent navigation when clicking on a link, button or dropdown
    if (isHomePage) {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, [role="menu"]')) {
            return;
        }
        router.push(`/post/${post.id}`);
    }
  }

  return (
    <>
      <Card 
        className={cn(
            "flex flex-col border-none shadow-md hover:shadow-xl transition-shadow duration-300 w-full",
            isHomePage && "h-48 cursor-pointer"
        )}
        onClick={handleCardClick}
      >
         <CardHeader className="p-4 flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
              </Avatar>
              <div>
                   <Link href={`/profile/${post.user.id}`} className="font-semibold text-sm hover:underline" onClick={e => e.stopPropagation()}>
                      {post.user.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                      {formatDate(post.createdAt)}
                  </p>
              </div>
          </div>
          {user?.uid === post.user.id && (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1">
          <p className={cn("text-foreground leading-relaxed", isHomePage && "line-clamp-2")}>{post.caption}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
           <div className="flex space-x-4 text-muted-foreground">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1" onClick={handleLike}>
                  <Heart className={cn("h-4 w-4", isLiked && "text-red-500 fill-red-500")} />
                  <span>{optimisticLikes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1" onClick={toggleComments}>
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments.length}</span>
              </Button>
           </div>
        </CardFooter>
        {showComments && (
          <CardContent className="p-4 pt-0">
            <CommentSection comments={post.comments} postId={post.id} category={post.category} profileUserId={post.user.id} />
          </CardContent>
        )}
      </Card>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    
