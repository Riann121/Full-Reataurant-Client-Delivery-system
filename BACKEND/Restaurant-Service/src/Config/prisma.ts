import { PrismaClient } from "@prisma/client/extension";

import "dotenv/config";

const prisma = new PrismaClient()

export default prisma