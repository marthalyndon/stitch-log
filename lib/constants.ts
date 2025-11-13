import { ProjectStatus } from "./types";

// Status configuration for projects
export const STATUS_CONFIG: Record<ProjectStatus, {
  label: string;
  color: string;
  badgeColor: string;
  dotColor: string;
}> = {
  idea: {
    label: "Idea",
    color: "bg-purple-100 border-purple-300",
    badgeColor: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    dotColor: "bg-purple-500",
  },
  queue: {
    label: "Queue",
    color: "bg-blue-100 border-blue-300",
    badgeColor: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    dotColor: "bg-blue-500",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-yellow-100 border-yellow-300",
    badgeColor: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    dotColor: "bg-yellow-500",
  },
  "on-hold": {
    label: "On Hold",
    color: "bg-gray-100 border-gray-300",
    badgeColor: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    dotColor: "bg-gray-500",
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 border-green-300",
    badgeColor: "bg-green-100 text-green-800 hover:bg-green-200",
    dotColor: "bg-green-500",
  },
};

// Status columns for board view (ordered)
export const STATUS_COLUMNS: { id: ProjectStatus; label: string; color: string }[] = [
  { id: 'idea', label: STATUS_CONFIG.idea.label, color: STATUS_CONFIG.idea.color },
  { id: 'queue', label: STATUS_CONFIG.queue.label, color: STATUS_CONFIG.queue.color },
  { id: 'in-progress', label: STATUS_CONFIG["in-progress"].label, color: STATUS_CONFIG["in-progress"].color },
  { id: 'on-hold', label: STATUS_CONFIG["on-hold"].label, color: STATUS_CONFIG["on-hold"].color },
  { id: 'completed', label: STATUS_CONFIG.completed.label, color: STATUS_CONFIG.completed.color },
];

