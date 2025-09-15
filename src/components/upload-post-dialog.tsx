
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { createPost } from "@/app/actions";
import { useAuth } from "@/hooks/use-auth";
import { ScrollArea } from "./ui/scroll-area";


const categories = ["Painting", "Photography", "Writing", "Music", "Crafts"];

const formSchema = z.object({
  caption: z.string().min(1, "Caption is required.").max(280, "Caption is too long."),
  category: z.string({ required_error: "Please select a category." }),
});


interface UploadPostDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function UploadPostDialog({ open, setOpen }: UploadPostDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
    },
  });
  
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            title: "Authentication required",
            description: "You must be signed in to upload a post.",
            variant: "destructive",
        });
        return;
    }

    setIsLoading(true);
    try {
        const result = await createPost({
            userId: user.uid,
            caption: values.caption,
            category: values.category,
        });

      if (result.success) {
        toast({
          title: "Post created!",
          description: "Your new post is now live.",
        });
        setOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Post creation error:", error);
      toast({
        title: "Error creating post",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col" aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle id="dialog-title">Upload a new post</DialogTitle>
          <DialogDescription id="dialog-description">
            Share your latest creation with the community.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about your project..." rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <DialogFooter className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Post
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
