// Drizzle文档中的示例模型架构
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  timestamp,
  varchar,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * 这是如何使用Drizzle ORM的多项目架构功能的示例。为多个项目使用相同的
 * 数据库实例。
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `gitdiagram_${name}`);

export const diagramCache = createTable(
  "diagram_cache",
  {
    username: varchar("username", { length: 256 }).notNull(),
    repo: varchar("repo", { length: 256 }).notNull(),
    diagram: varchar("diagram", { length: 10000 }).notNull(), // 根据需要调整长度
    explanation: varchar("explanation", { length: 10000 })
      .notNull()
      .default("No explanation provided"), // 默认解释，避免现有行的数据丢失
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    usedOwnKey: boolean("used_own_key").default(false),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.username, table.repo] }),
  }),
);
