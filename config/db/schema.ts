import { json, text } from "drizzle-orm/gel-core";
// import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { integer, pgTable, varchar, serial } from 'drizzle-orm/pg-core';

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer(),
});

// export const sessionChatTable = pgTable('sessionChatTable', {
//     id: integer().primaryKey().generatedAlwaysAsIdentity(),
//     sessionId: varchar().notNull(),
//     notes: text(),
//     selectedDoctor: json(),
//     conversation: json(),
//     report: json(),
//     createdBy: varchar().references(() => usersTable.email),
//     createdOn: varchar(),
// });

export const sessionChatTable = pgTable("sessionChatTable", (t) => ({
    id: t.serial("id").primaryKey(),
    sessionId: t.varchar("sessionId").notNull(),
    notes: t.text("notes"),
    selectedDoctor: t.json("selectedDoctor"),
    conversation: t.json("conversation"),
    report: t.json("report"),
    createdBy: t.varchar("createdBy").references(() => usersTable.email),
    createdOn: t.varchar("createdOn"),
}));

