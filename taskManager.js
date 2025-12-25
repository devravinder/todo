/* ============================================================
   Markdown Task Manager
   Source of truth: Markdown
   ============================================================ */

/* ---------- Helpers ---------- */

const GROUP_HEADING = /^###\s+(.*)$/;
const TASK_HEADING = /^####\s+(.+?)\s*\|\s*(.+)$/;
const FIELD_LINE = /^- ([^:]+):(.*)$/;
const CONFIG_SECTION = /^## ⚙️ Configurations/;

/* ---------- Parse Whole Markdown ---------- */

export function parseMarkdown(md) {
  const lines = md.split("\n");
  const data = {
    groups: {},
    config: {}
  };

  let currentGroup = null;
  let currentTask = null;
  let inConfig = false;
  let currentConfigKey = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    /* ---- Group ---- */
    const groupMatch = line.match(GROUP_HEADING);
    if (groupMatch) {
      currentGroup = groupMatch[1].trim();
      data.groups[currentGroup] = [];
      currentTask = null;
      inConfig = false;
      continue;
    }

    /* ---- Task ---- */
    const taskMatch = line.match(TASK_HEADING);
    if (taskMatch && currentGroup) {
      currentTask = {
        id: taskMatch[1].trim(),
        title: taskMatch[2].trim(),
        fields: {}
      };
      data.groups[currentGroup].push(currentTask);
      continue;
    }

    /* ---- Config section ---- */
    if (CONFIG_SECTION.test(line)) {
      inConfig = true;
      currentGroup = null;
      currentTask = null;
      continue;
    }

    /* ---- Config keys ---- */
    if (inConfig && line.startsWith("- ")) {
      const key = line.replace("- ", "").replace(":", "").trim();
      currentConfigKey = key;
      data.config[key] = [];
      continue;
    }

    if (inConfig && line.startsWith("  -")) {
      data.config[currentConfigKey].push(
        line.replace("  - ", "").trim()
      );
      continue;
    }

    /* ---- Task fields ---- */
    if (currentTask) {
      const fieldMatch = line.match(FIELD_LINE);
      if (!fieldMatch) continue;

      const key = fieldMatch[1].trim();
      const value = fieldMatch[2].trim();

      if (value === "") {
        currentTask.fields[key] = [];
      } else {
        currentTask.fields[key] = value;
      }
      continue;
    }

    /* ---- Subtasks ---- */
    if (
      currentTask &&
      Array.isArray(currentTask.fields.Subtasks) &&
      line.startsWith("  - ")
    ) {
      currentTask.fields.Subtasks.push(
        line.replace("  - ", "")
      );
    }
  }

  return data;
}

/* ---------- Add Task ---------- */

export function addTask(data, group, task) {
  if (!data.groups[group]) {
    data.groups[group] = [];
  }
  data.groups[group].push(task);
}

/* ---------- Update Task ---------- */

export function updateTask(data, taskId, updater) {
  for (const group of Object.values(data.groups)) {
    const task = group.find(t => t.id === taskId);
    if (task) {
      updater(task);
      return true;
    }
  }
  return false;
}

/* ---------- Delete Task ---------- */

export function deleteTask(data, taskId) {
  for (const groupName in data.groups) {
    const group = data.groups[groupName];
    const index = group.findIndex(t => t.id === taskId);
    if (index !== -1) {
      group.splice(index, 1);
      return true;
    }
  }
  return false;
}

/* ---------- Move Task ---------- */

export function moveTask(data, taskId, targetGroup) {
  let taskToMove = null;

  for (const groupName in data.groups) {
    const group = data.groups[groupName];
    const index = group.findIndex(t => t.id === taskId);
    if (index !== -1) {
      taskToMove = group.splice(index, 1)[0];
      break;
    }
  }

  if (!taskToMove) return false;

  if (!data.groups[targetGroup]) {
    data.groups[targetGroup] = [];
  }

  data.groups[targetGroup].push(taskToMove);
  return true;
}

/* ---------- Update Config ---------- */

export function updateConfig(data, key, values) {
  data.config[key] = values;
}

/* ---------- Convert JSON → Markdown ---------- */

export function toMarkdown(data) {
  const lines = [];

  lines.push("# Todo\n");
  lines.push("## Tasks\n");

  /* ---- Groups & Tasks ---- */
  for (const groupName in data.groups) {
    lines.push(`### ${groupName}\n`);

    for (const task of data.groups[groupName]) {
      lines.push(`#### ${task.id} | ${task.title}\n`);

      for (const [key, value] of Object.entries(task.fields)) {
        if (Array.isArray(value)) {
          lines.push(`- ${key}:`);
          value.forEach(v => lines.push(`  - ${v}`));
        } else {
          lines.push(`- ${key}: ${value}`);
        }
      }
      lines.push("");
    }
  }

  /* ---- Config ---- */
  lines.push("---\n");
  lines.push("## ⚙️ Configurations\n");

  for (const key in data.config) {
    lines.push(`- ${key}:`);
    data.config[key].forEach(v => lines.push(`  - ${v}`));
    lines.push("");
  }

  return lines.join("\n");
}
