import { pgTable, serial, text, varchar, integer, enum as pgEnum} from "drizzle-orm/pg-core";

export const genderIdentityEnum = pgEnum('gender_identity', ['male', 'female', 'non-binary', 'other']);
export const sexualIdentityEnum = pgEnum('sexual_identity', ['heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual', 'aroace', 'aromantic', 'demisexual', 'other'])

export const TEST = pgTable("TEST", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 255 }).unique(),
});

export const users = pgTable("User", {
  userId: serial("user_id").primaryKey(),
  username: varchar('username', {length: 255}).notNull(),
  password: varchar('password', {length: 255}).notNull(),
  name: varchar('name', {length: 255}).notNull(),
  pronouns: varchar('pronouns', {length: 255}).notNull(), 
  genderIdentity: genderIdentityEnum('gender_identity').notNull(),
  sexualIdentity: sexualIdentityEnum('sexual_identity').notNull(),
  bio: text('bio'),
  college: varchar('college', {length: 255}),
  major: varchar('major', {length: 255}), 
  age: integer('age'),
});

export const connectionStatusEnum = pgEnum('connection_status', ['pending', 'accepted', 'rejected']); 

export const connection = pgTable('connections',{
  connectId: serial('connectId').primaryKey(),
  user1Id: integer('user1_id')
    .notNull()
    .references(() => users.userId),
  user2Id: integer('user2_id')
    .notNull()
    .references(() => users.userId),
  status: connectionStatusEnum('status').default('pending'),
});