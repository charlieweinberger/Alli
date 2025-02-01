import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const TEST = pgTable("TEST", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 255 }).unique(),
});
