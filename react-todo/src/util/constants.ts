export const DATE_FORMAT="DD-MMM-YYYY"
export const FORM_DATE_FORMAT="YYYY-MM-DD"

export const defaultConfig: TodoConfig = {
  Statuses: [
    "📝 To Do",
    "🚀 In Progress",
    "👀 In Review",
    "✅ Done",
    "📦 Archives",
  ],
  "Workflow Statuses": {
    CREATE_STATUS: "📝 To Do",
    START_STATUS: "🚀 In Progress",
    END_STATUS: "✅ Done",
    ARCHIVE_STATUS: "📦 Archives",
  },

  Categories: [
    "Frontend",
    "Backend",
    "Design",
    "DevOps",
    "Tests",
    "Documentation",
  ],

  Users: ["Ravinder", "Reddy"],

  Priorities: ["🔴 Critical", "🟠 High", "🟡 Medium", "🟢 Low"],
  "Priority Colors": {
    "🔴 Critical": {
      "text-color": "#991B1B",
      "bg-color": "#e8abab",
    },
    "🟠 High": {
      "text-color": "#a32900",
      "bg-color": "#fdb981",
    },
    "🟡 Medium": {
      "text-color": "#652525",
      "bg-color": "#ffea94",
    },
    "🟢 Low": {
      "text-color": "#166534",
      "bg-color": "#bcfbd2",
    },
  },

  Tags: [
    "#bug",
    "#feature",
    "#ui",
    "#backend",
    "#urgent",
    "#refactor",
    "#docs",
    "#test",
  ],
};
