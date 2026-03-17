import type { Item, Tag } from "../types";

export const mockTags = {
  bug: { id: 1, name: "Bug", color: "#EF4444" },
  feature: { id: 2, name: "Feature", color: "#22C55E" },
  enhancement: { id: 3, name: "Enhancement", color: "#3B82F6" },
};

export const mockItems = {
  simple: {
    id: 1,
    name: "Simple Task",
    description: "A simple task",
    due_date: null,
    tags: [],
  },
  withDescription: {
    id: 2,
    name: "Task with Description",
    description: "This is a detailed description",
    due_date: null,
    tags: [],
  },
  withTags: {
    id: 3,
    name: "Task with Tags",
    description: "Has multiple tags",
    due_date: null,
    tags: [mockTags.bug, mockTags.feature],
  },
  minimal: { id: 4, name: "Minimal", description: "", due_date: null, tags: [] },
};

export function createMockItem(overrides?: Partial<Item>): Item {
  return {
    id: Math.floor(Math.random() * 10000),
    name: "Test Task",
    description: "Test description",
    due_date: null,
    tags: [],
    ...overrides,
  };
}

export function createMockTag(overrides?: Partial<Tag>): Tag {
  return {
    id: Math.floor(Math.random() * 10000),
    name: "Test Tag",
    color: "#6366F1",
    ...overrides,
  };
}

export function createMockItems(count: number): Item[] {
  return Array.from({ length: count }, (_, i) =>
    createMockItem({ id: i + 1, name: `Task ${i + 1}` }),
  );
}
