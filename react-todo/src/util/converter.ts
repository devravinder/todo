import dayjs from "dayjs";
import { FORM_DATE_FORMAT } from "./constants";

const ID_TITLE_DELIMETER = " | " as const;
type ID_TITLE_DELIMETER = typeof ID_TITLE_DELIMETER;

type StoreTasks = Record<
  string,
  Record<`${Task["Id"]}${ID_TITLE_DELIMETER}${Task["Title"]}`, Task>
>;
export type StoreData = {
  Todo: {
    Tasks: StoreTasks;
    "⚙️ Configuration": TodoConfig;
  };
};

type TaskKey = keyof Task;

export const serializers: Partial<{
  [K in TaskKey]: (v: Task[K]) => string;
}> = {
  dueDate: (v) => dayjs(v).format(FORM_DATE_FORMAT),
  createdDate: (v) => dayjs(v).format(FORM_DATE_FORMAT),
  startedDate: (v) => dayjs(v).format(FORM_DATE_FORMAT),
  completedDate: (v) => dayjs(v).format(FORM_DATE_FORMAT),
};

const serializeTask = (task: Task) => {
  const some = (Object.keys(serializers) as TaskKey[]).reduce((pre, key) => {
    if (key in serializers && task[key]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pre as any)[key] = serializers[key]?.(task[key] as any);
    }

    return pre;
  }, {} as Task);

  return { ...task, ...some };
};

export type AppData = { tasks: Task[]; config: TodoConfig };
export const toStoreData = (tasks: Task[], config: TodoConfig) => {
  const data: StoreData = {
    Todo: {
      "⚙️ Configuration": config,
      Tasks: {},
    },
  };

  data.Todo.Tasks = tasks.reduce((pre, task) => {
    if (!pre[task.Status]) pre[task.Status] = {};

    pre[task.Status][`${task.Id}${ID_TITLE_DELIMETER}${task.Title}`] =
      serializeTask(task);

    return pre;
  }, {} as StoreTasks);

  return data;
};

export const toAppData = (data: StoreData) => {
  const tasks: Task[] = [];

  Object.keys(data?.Todo?.Tasks || {}).reduce((pre, status) => {
    pre.push(...Object.values(data.Todo.Tasks[status]));
    return pre;
  }, tasks);

  return { tasks, config: data.Todo["⚙️ Configuration"] };
};
