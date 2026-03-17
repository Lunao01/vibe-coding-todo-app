import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "./TaskCard";
import { mockItems } from "../test/mock-data";

describe("TaskCard", () => {
  const defaultProps = {
    item: mockItems.simple,
    onDelete: vi.fn(),
    onEdit: vi.fn(),
    onDragStart: vi.fn(),
  };

  it("renders task name", () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.getByText(mockItems.simple.name)).toBeInTheDocument();
  });

  it("renders task description when provided", () => {
    render(<TaskCard {...defaultProps} item={mockItems.withDescription} />);
    expect(
      screen.getByText(mockItems.withDescription.description),
    ).toBeInTheDocument();
  });

  it("does not render description when empty", () => {
    const itemWithoutDesc = { ...mockItems.simple, description: "" };
    render(<TaskCard {...defaultProps} item={itemWithoutDesc} />);

    // Only the name should be visible
    expect(screen.getByText(itemWithoutDesc.name)).toBeInTheDocument();
    const taskCard = screen.getByTestId(`task-${itemWithoutDesc.id}`);
    expect(taskCard.querySelectorAll("p").length).toBe(0);
  });

  it("renders tags when present", () => {
    render(<TaskCard {...defaultProps} item={mockItems.withTags} />);

    mockItems.withTags.tags.forEach((tag) => {
      expect(screen.getByText(tag.name)).toBeInTheDocument();
    });
  });

  it("does not render tags section when no tags", () => {
    render(<TaskCard {...defaultProps} item={mockItems.simple} />);

    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);
    const tagContainer = taskCard.querySelector(".flex.flex-wrap.gap-1\\.5");
    expect(tagContainer).not.toBeInTheDocument();
  });

  it("renders delete button", () => {
    render(<TaskCard {...defaultProps} />);
    expect(
      screen.getByTestId(`delete-task-${mockItems.simple.id}`),
    ).toBeInTheDocument();
  });

  it("renders edit button", () => {
    render(<TaskCard {...defaultProps} />);
    expect(
      screen.getByTestId(`edit-task-${mockItems.simple.id}`),
    ).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<TaskCard {...defaultProps} onEdit={onEdit} />);

    const editButton = screen.getByTestId(`edit-task-${mockItems.simple.id}`);
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockItems.simple);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<TaskCard {...defaultProps} onDelete={onDelete} />);

    const deleteButton = screen.getByTestId(
      `delete-task-${mockItems.simple.id}`,
    );
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockItems.simple.id);
  });

  it("is draggable", () => {
    render(<TaskCard {...defaultProps} />);
    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);
    expect(taskCard).toHaveAttribute("draggable", "true");
  });

  it("calls onDragStart when drag starts", () => {
    const onDragStart = vi.fn();
    render(<TaskCard {...defaultProps} onDragStart={onDragStart} />);

    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);
    const dragEvent = new Event("dragstart", { bubbles: true });

    taskCard.dispatchEvent(dragEvent);

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenCalledWith(
      expect.any(Object),
      mockItems.simple,
    );
  });

  it("has correct styling classes", () => {
    render(<TaskCard {...defaultProps} />);
    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);

    expect(taskCard).toHaveClass("group");
    expect(taskCard).toHaveClass("rounded-lg");
    expect(taskCard).toHaveClass("cursor-grab");
  });

  describe("due date indicator", () => {
    it("does not render due date indicator when due_date is null", () => {
      render(<TaskCard {...defaultProps} item={mockItems.simple} />);
      expect(
        screen.queryByTestId(`due-date-indicator-${mockItems.simple.id}`),
      ).not.toBeInTheDocument();
    });

    it("renders due date indicator with red color when overdue", () => {
      const overdueItem = {
        ...mockItems.simple,
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      };
      render(<TaskCard {...defaultProps} item={overdueItem} />);
      const indicator = screen.getByTestId(
        `due-date-indicator-${overdueItem.id}`,
      );
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass("bg-red-100");
      expect(indicator).toHaveClass("text-red-700");
    });

    it("renders due date indicator with orange color when due within 1 day", () => {
      const dueSoonItem = {
        ...mockItems.simple,
        due_date: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      };
      render(<TaskCard {...defaultProps} item={dueSoonItem} />);
      const indicator = screen.getByTestId(
        `due-date-indicator-${dueSoonItem.id}`,
      );
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass("bg-orange-100");
      expect(indicator).toHaveClass("text-orange-700");
    });

    it("renders due date indicator with yellow color when due within 2–3 days", () => {
      const dueSoonItem = {
        ...mockItems.simple,
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      };
      render(<TaskCard {...defaultProps} item={dueSoonItem} />);
      const indicator = screen.getByTestId(
        `due-date-indicator-${dueSoonItem.id}`,
      );
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass("bg-yellow-100");
      expect(indicator).toHaveClass("text-yellow-700");
    });

    it("renders due date indicator with green color when due in more than 3 days", () => {
      const upcomingItem = {
        ...mockItems.simple,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      render(<TaskCard {...defaultProps} item={upcomingItem} />);
      const indicator = screen.getByTestId(
        `due-date-indicator-${upcomingItem.id}`,
      );
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass("bg-green-100");
      expect(indicator).toHaveClass("text-green-700");
    });
  });
});
