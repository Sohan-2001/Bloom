'use server';

import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './firebase';

export interface FeaturedPost {
  id: string;
  link: string;
}

export async function getFeaturedPosts(): Promise<FeaturedPost[]> {
  try {
    const q = query(collection(db, 'featured'));
    const querySnapshot = await getDocs(q);
    const posts: FeaturedPost[] = [];
    querySnapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() } as FeaturedPost);
    });
    return posts;
  } catch (error) {
    console.error('Error fetching featured posts: ', error);
    return [];
  }
}
