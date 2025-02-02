import { pgTable, serial, text, timestamp, boolean, varchar, integer, enum as pgEnum} from "drizzle-orm/pg-core";

export const genderIdentityEnum = pgEnum('gender_identity', ['male', 'female', 'non-binary', 'other']);
export const sexualIdentityEnum = pgEnum('sexual_identity', ['heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual', 'aroace', 'aromantic', 'demisexual', 'other']);

export const users = pgTable('User', {
  userId: serial('userId').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  pronouns: text('pronouns').notNull(), 
  genderIdentity: text('genderIdentity'),
  sexuality: text('sexuality'),
  bio: text('bio'),
  college: text('college'),
  major: text('major'), 
  age: integer('age'),
});

export const connectionStatusEnum = pgEnum('connection_status', ['pending', 'accepted', 'rejected']); 

export const connection = pgTable('connections',{
  connectId: serial('connectId').primaryKey(),
  poster: integer('poster')
    .notNull()
    .references(() => users.userId),
  responder: integer('responder')
    .notNull()
    .references(() => users.userId),
  status: connectionStatusEnum('status').default('pending'),
});

export const bucket = pgTable('Bucket', {
  userId: serial('userIJd')
    .notNull()
    .references(() => users.userId),
  bucketId: serial("bucketId").primaryKey(),
  bucketName: text('bucketName'),
  profilePicture: text('profilePicture')
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  connectionId: integer('connection_id')
    .notNull()
    .references(() => connection.id),
  senderId: integer('sender_id')
    .notNull()
    .references(() => users.userId), 
  receiverId: integer('receiver_id')
    .notNull()
    .references(() => users.userId),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  isRead: boolean('is_read').default(false),
});