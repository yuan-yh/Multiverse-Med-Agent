import { json, text } from "drizzle-orm/gel-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer(),
});

export const sessionChatTable = pgTable("sessionChatTable", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sessionId: varchar().notNull(),
    notes: text(),
    conversation: json(),
    report: json(),
    createdBy: varchar().references(() => usersTable.email),
    createdOn: varchar(),
});