import "dotenv/config";
import { defineConfig } from "prisma/config";
export default defineConfig({
    schema: 'prisma/schema.prisma', // path to your schema
    migrations: {
        path: 'prisma/migrations', // where migration files are stored
    },
    datasource: {
        url: process.env.DATABASE_URL, // database URL from .env
    },
});
