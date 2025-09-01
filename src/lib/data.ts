
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
  image: string;
  imageHint: string;
  caption: string;
  category: string;
  likes: number;
  comments: Comment[];
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

const generateComments = (count: number): Comment[] => {
    const comments: Comment[] = [];
    for (let i = 0; i < count; i++) {
        const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        comments.push({
            id: `c${i}${Date.now()}`,
            user,
            text: 'This is amazing! Great work.',
        });
    }
    return comments;
}

export const mockPosts: Post[] = [
  {
    id: 'p1',
    user: mockUsers[0],
    image: 'https://picsum.photos/id/1040/600/400',
    imageHint: 'castle architecture',
    caption: 'Finished my latest watercolor of a castle by the sea. Took a while but I love how the colors came out!',
    category: 'Painting',
    likes: 124,
    comments: generateComments(5),
  },
  {
    id: 'p2',
    user: mockUsers[1],
    image: 'https://picsum.photos/id/1055/600/400',
    imageHint: 'street photography',
    caption: 'A quiet alleyway in the city. The light was just perfect.',
    category: 'Photography',
    likes: 256,
    comments: generateComments(12),
  },
  {
    id: 'p3',
    user: mockUsers[2],
    image: 'https://picsum.photos/id/122/600/400',
    imageHint: 'writing journal',
    caption: 'Chapter 3 is done! This one was a beast to write, but the story is finally taking shape.',
    category: 'Writing',
    likes: 88,
    comments: generateComments(8),
  },
  {
    id: 'p4',
    user: mockUsers[4],
    image: 'https://picsum.photos/id/163/600/400',
    imageHint: 'knitting craft',
    caption: 'A cozy new scarf for the winter. The pattern was tricky but worth it!',
    category: 'Crafts',
    likes: 312,
    comments: generateComments(21),
  },
  {
    id: 'p5',
    user: mockUsers[3],
    image: 'https://picsum.photos/id/145/600/400',
    imageHint: 'music production',
    caption: 'New chillhop track "Bloom" is out now. Link in bio!',
    category: 'Music',
    likes: 489,
    comments: generateComments(45),
  },
  {
    id: 'p6',
    user: mockUsers[0],
    image: 'https://picsum.photos/id/219/600/400',
    imageHint: 'abstract painting',
    caption: 'Experimenting with some abstract forms and our theme colors. What do you see?',
    category: 'Painting',
    likes: 97,
    comments: generateComments(10),
  },
  {
    id: 'p7',
    user: mockUsers[1],
    image: 'https://picsum.photos/id/257/600/400',
    imageHint: 'nature macro',
    caption: 'Macro shot of a dandelion. So much detail in the small things.',
    category: 'Photography',
    likes: 188,
    comments: generateComments(15),
  },
   {
    id: 'p8',
    user: mockUsers[4],
    image: 'https://picsum.photos/id/305/600/400',
    imageHint: 'pottery craft',
    caption: 'My first attempt at pottery. It\'s a bit wobbly, but it\'s mine!',
    category: 'Crafts',
    likes: 205,
    comments: generateComments(18),
  },
  {
    id: 'p9',
    user: mockUsers[2],
    image: 'https://picsum.photos/id/355/600/400',
    imageHint: 'book typewriter',
    caption: 'A single line from my new poem: "The city breathes in neon sighs."',
    category: 'Writing',
    likes: 154,
    comments: generateComments(11),
  },
    {
    id: 'p10',
    user: mockUsers[0],
    image: 'https://picsum.photos/id/410/600/400',
    imageHint: 'mountain landscape',
    caption: 'Quick gouache study of the mountains near my home.',
    category: 'Painting',
    likes: 182,
    comments: generateComments(14),
  },
];
