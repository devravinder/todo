declare global {
  interface Task {
    Id?: string;
    Title: string;
    Description: string;
    Priority: string;
    AssignedTo?: string;
    createdDate: Date;
    startedDate?: Date;
    dueDate: Date;
    completedDate?: Date;
    Tags: string[];
    Subtasks: string[];
    Notes: string;
    Status: string;
  }

  interface TodoConfig {
    Statuses: string[];
    "Workflow Statuses": Record<string, string>
    Categories: string[];
    Users: string[];
    Priorities: string[];
    "Priority Colors": Record<string, Record<string, string | Record<string, string>>>;
    Tags: string[];
  }
}

export {};
