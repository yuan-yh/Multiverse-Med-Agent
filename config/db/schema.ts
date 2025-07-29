import { json, text } from "drizzle-orm/gel-core";
// import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { pgTable, integer, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer(),
});

export const sessionChatTable = pgTable("sessionChatTable", (t) => ({
    id: t.serial("id").primaryKey(),
    sessionId: t.varchar("sessionId").notNull(),
    notes: t.text("notes"),
    selectedDoctor: t.json("selectedDoctor"),
    conversation: t.json("conversation"),
    report: t.json("report"),
    createdBy: t.varchar("createdBy").references(() => usersTable.email),
    createdOn: t.varchar("createdOn"),

    // Medical images
    // hasImage: t.boolean("hasImage").default(false),
    // imageCount: t.integer("imageCount").default(0),
    imageData: t.text("imageData"), // Base64 encoded image
    imageFileName: t.varchar("imageFileName"),
    imageFileType: t.varchar("imageFileType"),
}));

// Enum for image types
// export const imageTypeEnum = pgEnum("image_type", ["mammogram", "ultrasound", "mri", "other"]);

// export const medicalImages = pgTable("medicalImages", (t) => ({
//     id: t.serial("id").primaryKey(),
//     sessionId: t.integer("session_id")
//         .notNull()
//         .references(() => sessionChatTable.id)
//         .onDelete("cascade"),

//     // File metadata
//     fileName: t.varchar("fileName").notNull(),
//     fileSize: t.integer("fileSize").notNull(), // in bytes
//     mimeType: t.varchar("mimeType").notNull(),
//     imageType: imageTypeEnum("imageType"),

//     // Storage information
//     storageUrl: t.varchar("storageUrl").notNull(), // URL in object storage (S3, R2, etc.)
//     storageKey: t.varchar("storageKey").notNull(), // Unique key in storage
//     storageBucket: t.varchar("storageBucket").notNull(),

//     // Medical metadata
//     isDicom: t.boolean("isDicom").default(false),
//     dicomMetadata: t.json("dicomMetadata"), // Store DICOM tags if applicable

//     // Audit fields
//     uploadedBy: t.varchar("uploadedBy").references(() => usersTable.email),
//     uploadedOn: t.timestamp("uploadedOn").defaultNow(),
//     lastAccessedOn: t.timestamp("lastAccessedOn"),

//     // Security
//     isEncrypted: t.boolean("isEncrypted").default(true),
//     checksumSha256: t.varchar("checksumSha256"), // For integrity verification
// }));

