import { toStoreData } from "./converter";

export const syncWithStore = (tasks: Task[], config: TodoConfig) => {

    const storeData = toStoreData(tasks, config)
    console.log({storeData})
};
