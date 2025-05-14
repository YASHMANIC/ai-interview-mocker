import { PrismaClient } from "@/src/generated/prisma";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var, vars-on-top
  var db: PrismaClient | undefined;
}

export const db = globalThis.db || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  // in development mode, add db to the global scope
  globalThis.db = db;
}


