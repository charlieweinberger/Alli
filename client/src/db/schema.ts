import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("User", {
  userId: serial("userId").primaryKey(),
  username: text("username").notNull(),
  // password: text('password').notNull(),
  name: text("name").notNull(),
  pronouns: text("pronouns").notNull(),
  genderIdentity: text("genderIdentity"),
  sexuality: text("sexuality"),
  bio: text("bio"),
  hobbies: text("hobbies"),
  major: text("major"),
  age: integer("age"),
});

export const post = pgTable("Post", {
  userId: integer("userId")
    .notNull()
    .references(() => users.userId),
  postId: serial("postId").primaryKey(),
  title: text("title"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const connection = pgTable("connections", {
  connectId: serial("connectId").primaryKey(),
  user: integer("poster")
    .notNull()
    .references(() => users.userId),
  responder: integer("responder")
    .notNull()
    .references(() => users.userId),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  connectionId: integer("connection_id")
    .notNull()
    .references(() => connection.connectId),
  senderId: integer("sender_id")
    .notNull()
    .references(() => users.userId),
  receiverId: integer("receiver_id")
    .notNull()
    .references(() => users.userId),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});
