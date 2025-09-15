
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
import { Input } from "@/components/ui/input";
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
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { createPost } from "@/app/actions";
import { useAuth } from "@/hooks/use-auth";


const categories = ["Painting", "Photography", "Writing", "Music", "Crafts"];

const formSchema = z.object({
  caption: z.string().min(1, "Caption is required.").max(280, "Caption is too long."),
  category: z.string({ required_error: "Please select a category." }),
  image: z.any().refine(file => file, "Please upload an image."),
});


interface UploadPostDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function UploadPostDialog({ open, setOpen }: UploadPostDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue("image", file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  useEffect(() => {
    if (!open) {
      form.reset();
      setImagePreview(null);
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
    if (!imagePreview) {
        form.setError("image", { type: "manual", message: "Please upload an image." });
        return;
    }


    setIsLoading(true);
    try {
        const result = await createPost({
            userId: user.uid,
            caption: values.caption,
            category: values.category,
            imageDataUri: imagePreview,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a new post</DialogTitle>
          <DialogDescription>
            Share your latest creation with the community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                   <FormControl>
                     <div className="relative flex justify-center items-center w-full h-64 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Image preview" fill className="object-contain rounded-md" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Upload className="h-8 w-8" />
                                <span>Click to upload</span>
                            </div>
                        )}
                        <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                        />
                     </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about your project..." {...field} />
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
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
