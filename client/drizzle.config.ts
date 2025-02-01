import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  },
});
