
export type User = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
};

export type Comment = {
  id: string;
  user: User;
  text: string;
};

export type Post = {
  id: string;
  user: User;
  caption: string;
  category: string;
  likes: number;
  comments: Comment[];
  createdAt: any;
};

export const mockUsers: User[] = [
  // IMPORTANT: The first user's ID 'u1' is manually mapped to a Firebase UID in the profile page for demo purposes.
  // In a real app, you would create user profiles in your database with their Firebase UID as the document ID.
  { id: 'u1', name: 'CreativeCat', avatar: 'https://picsum.photos/id/1025/100/100', bio: 'Painting my world one color at a time. Exploring new mediums and sharing my journey with the world. Join me!' },
  { id: 'u2', name: 'LensLife', avatar: 'https://picsum.photos/id/1011/100/100', bio: 'Capturing moments through my lens. Life is beautiful, and I want to show you my perspective.' },
  { id: 'u3', name: 'WordWeaver', avatar: 'https://picsum.photos/id/237/100/100', bio: 'Spinning tales and weaving words. I write short stories, poetry, and occasionally ramble about books.' },
  { id: 'u4', name: 'MelodyMaker', avatar: 'https://picsum.photos/id/1084/100/100', bio: 'Crafting sounds and chasing melodies. I produce electronic music and DJ on weekends.' },
  { id: 'u5', name: 'HandmadeHeart', avatar: 'https://picsum.photos/id/1078/100/100', bio: 'Knitting, stitching, and creating with love. All things crafty and cozy.' },
];
