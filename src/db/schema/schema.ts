import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createAt: timestamp("create_at").defaultNow(),
});

//habits table
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  categoryId: integer("category_id").references(() => habitCategories.id),
  name: text("name").notNull(),
  description: text("descriptionf"),
  frequency: text("frequency").notNull(),
  goal: integer("goal").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  startDateL: date("start_date").notNull(),
  endDate: date("end_date"),
});

//habit categories table
export const habitCategories = pgTable("habit_categories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  color: text("color").notNull(),
});

//streak table
export const streaks = pgTable("streaks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  habitId: integer("habit_id").references(() => habits.id),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_steak").notNull().default(0),
  lastCompletedDate: date("last_completed_date"),
});

//relations

//user relations
export const userRelations = relations(users, ({ many }) => ({
  habits: many(habits),
  habitCategories: many(habitCategories),
}));

//habit relations
export const habitRelations = relations(habits, ({ one }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  category: one(habitCategories, {
    fields: [habits.categoryId],
    references: [habitCategories.id],
  }),
  streak: one(streaks),
}));

//habit categories relations
export const habitCategoryRelations = relations(
  habitCategories,
  ({ many, one }) => ({
    habits: many(habits),
    users: one(users, {
      fields: [habitCategories.userId],
      references: [users.id],
    }),
  })
);

//streak relations
export const streakRelations = relations(streaks, ({ one }) => ({
  habits: one(habits),
  users: one(users, {
    fields: [streaks.userId],
    references: [users.id],
  }),
}));
