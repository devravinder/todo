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

export const toStoreData = (tasks: Task[], config: TodoConfig) => {
  const data: StoreData = {
    Todo: {
      "⚙️ Configuration": config,
      Tasks: {},
    },
  };

  data.Todo.Tasks = tasks.reduce((pre, task) => {
    if (!pre[task.Status]) pre[task.Status] = {};

    pre[task.Status][`${task.Id}${ID_TITLE_DELIMETER}${task.Title}`] = task;

    return pre;
  }, {} as StoreTasks);

  return data;
};

export const toAppData = (data: StoreData) => {
  const tasks: Task[] = [];

  Object.keys(data.Todo.Tasks).reduce((pre, status) => {
    pre.push(...Object.values(data.Todo.Tasks[status]));
    return pre;
  }, tasks);

  return { tasks, config: data.Todo["⚙️ Configuration"] };
};
