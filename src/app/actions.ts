
"use server";

import { suggestProjectPrompts } from "@/ai/flows/ai-suggested-project-prompts";
import type { SuggestProjectPromptsOutput } from "@/ai/flows/ai-suggested-project-prompts";
import type { Post, User } from "@/lib/data";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, getDoc, doc, Timestamp, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { revalidatePath } from "next/cache";

export async function getAiSuggestions(): Promise<SuggestProjectPromptsOutput> {
  // In a real application, you would fetch the current user's actual data.
  // For this demo, we're using mock data representing a user's interests.
  const mockUserInput = {
    userPosts: `
      - "Finished my latest watercolor of a castle by the sea."
      - "Experimenting with some abstract forms and our theme colors."
      - "My first attempt at pottery. It's a bit wobbly, but it's mine!"
    `,
    userLikes: `
      - A post about oil painting techniques for landscapes.
      - A photo of a hand-thrown ceramic vase.
      - A tutorial on mixing colors for watercolor painting.
    `,
  };

  try {
    const suggestions = await suggestProjectPrompts(mockUserInput);
    return suggestions;
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    // You might want to throw a more specific error or handle it differently
    throw new Error("Failed to get AI suggestions.");
  }
}

export type FeaturedPost = {
  id: string;
  link: string;
};

export async function getFeaturedPosts(): Promise<FeaturedPost[]> {
  try {
    const featuredCollection = collection(db, "featured");
    const snapshot = await getDocs(featuredCollection);
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      link: doc.data().link,
    }));
    return posts;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export type CreatePostInput = {
    userId: string;
    caption: string;
    category: string;
};

export async function createPost(input: CreatePostInput) {
    const { userId, caption, category } = input;

    try {
        // Create post document in Firestore
        await addDoc(collection(db, "posts"), {
            userId: userId,
            caption: caption,
            category: category,
            createdAt: serverTimestamp(),
            likes: 0,
            comments: [],
        });

        // Revalidate path to show new post
        revalidatePath("/");
        revalidatePath(`/category/${category.toLowerCase()}`);
        revalidatePath(`/profile/${userId}`);

        return { success: true };
    } catch (error) {
        console.error("Error creating post:", error);
        return { success: false, error: "Failed to create post." };
    }
}


export async function getPosts(): Promise<Post[]> {
    try {
        const postsCollection = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(postsCollection);
        
        const posts: Post[] = await Promise.all(snapshot.docs.map(async (p) => {
            const postData = p.data();
            const userDoc = await getDoc(doc(db, "users", postData.userId));
            
            let user: User;
            if (userDoc.exists()) {
                 const userData = userDoc.data();
                 user = {
                    id: userData.uid,
                    name: userData.displayName,
                    avatar: userData.photoURL,
                    bio: userData.bio,
                 }
            } else {
                // Fallback user
                user = { id: 'unknown', name: 'Unknown User', avatar: '', bio: '' };
            }
            
            const createdAtTimestamp = postData.createdAt as Timestamp;

            // Fetch user data for each comment
            const commentsWithUsers = await Promise.all(
              (postData.comments || []).map(async (comment: any) => {
                const commentUserDoc = await getDoc(doc(db, "users", comment.userId));
                let commentUser: User;
                if (commentUserDoc.exists()) {
                  const commentUserData = commentUserDoc.data();
                  commentUser = {
                    id: commentUserData.uid,
                    name: commentUserData.displayName,
                    avatar: commentUserData.photoURL,
                    bio: commentUserData.bio,
                  };
                } else {
                  commentUser = { id: 'unknown', name: 'Unknown User', avatar: '', bio: '' };
                }
                
                const commentCreatedAtTimestamp = comment.createdAt as Timestamp;

                return {
                  id: comment.id,
                  user: commentUser,
                  text: comment.text,
                  createdAt: commentCreatedAtTimestamp ? {
                    seconds: commentCreatedAtTimestamp.seconds,
                    nanoseconds: commentCreatedAtTimestamp.nanoseconds,
                } : null,
                };
              })
            );


            return {
                id: p.id,
                user: user,
                caption: postData.caption,
                category: postData.category,
                likes: postData.likes,
                comments: commentsWithUsers,
                createdAt: createdAtTimestamp ? {
                    seconds: createdAtTimestamp.seconds,
                    nanoseconds: createdAtTimestamp.nanoseconds,
                } : null,
            };
        }));
        
        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function likePost(postId: string) {
    try {
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
            likes: increment(1)
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error liking post:", error);
        return { success: false, error: "Failed to like post." };
    }
}

export async function addComment(postId: string, userId: string, commentText: string, category: string, profileUserId: string) {
    if (!commentText.trim()) {
        return { success: false, error: "Comment cannot be empty." };
    }
    
    try {
        const postRef = doc(db, "posts", postId);

        const newComment = {
            id: doc(collection(db, "dummy")).id, // Generate a unique ID
            userId: userId,
            text: commentText,
            createdAt: serverTimestamp(),
        };

        await updateDoc(postRef, {
            comments: arrayUnion(newComment)
        });
        
        revalidatePath('/');
        revalidatePath(`/category/${category.toLowerCase()}`);
        revalidatePath(`/profile/${profileUserId}`);
        
        return { success: true };
    } catch (error) {
        console.error("Error adding comment:", error);
        return { success: false, error: "Failed to add comment." };
    }
}
