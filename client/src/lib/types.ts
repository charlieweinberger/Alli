export type User = {
  userId: number;
  username: string;
  name: string;
  pronouns: string;
  genderIdentity?: string;
  sexuality?: string;
  bio?: string;
  hobbies?: string;
  major?: string;
  age?: number;
};

export type Post = {
  userId: number;
  postId: number;
  title?: string;
  description?: string;
  createdAt: Date;
};

export type Connection = {
  connectId: number;
  user: number;
  responder: number;
};

export type Message = {
  id: number;
  connectionId: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
  isRead: boolean;
};
