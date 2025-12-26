
const root:any = {
  "Todo":{
    "Tasks":{

    }
  },
  "⚙️ Configuration": config
}

sampleTasks.forEach(task=>{
  const status = task.Status;

  if(!root.Todo.Tasks[status])
    root.Todo.Tasks[status]={}

  root.Todo.Tasks[status]={
    [`${task.Id} | ${task.Title}`]:task
  }
})


// console.log(JSON.stringify(root))