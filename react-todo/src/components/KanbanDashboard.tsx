import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from './Header';
import KanbanColumn from './KanbanColumn';
import TaskModal from './TaskModal';
import SettingsModal from './SettingsModal';
import { type Task } from './TaskCard';

export default function KanbanDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState(['Todo', 'In Progress', 'Done', 'Archive']);
  const [users, setUsers] = useState(['john', 'sarah', 'mike', 'emma']);
  const [tags, setTags] = useState(['bugs', 'feature', 'urgent', 'enhancement', 'documentation']);
  const [priorities, setPriorities] = useState(['Low', 'Medium', 'High']);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState('Todo');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    const savedGroups = localStorage.getItem('kanban-groups');
    const savedUsers = localStorage.getItem('kanban-users');
    const savedTags = localStorage.getItem('kanban-tags');
    const savedPriorities = localStorage.getItem('kanban-priorities');

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        created: new Date(task.created),
        started: task.started ? new Date(task.started) : undefined,
        due: task.due ? new Date(task.due) : undefined,
        completed: task.completed ? new Date(task.completed) : undefined
      }));
      setTasks(parsedTasks);
    } else {
      // Initialize with sample data
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Design user interface mockups',
          description: 'Create wireframes and high-fidelity mockups for the new dashboard',
          priority: 'High',
          assignedTo: 'sarah',
          created: new Date('2025-01-01'),
          due: new Date('2025-01-15'),
          tags: ['design', 'ui'],
          subtasks: [
            { id: '1', text: 'Create wireframes', completed: true },
            { id: '2', text: 'Design high-fidelity mockups', completed: false }
          ],
          notes: 'Focus on mobile-first approach',
          status: 'In Progress'
        },
        {
          id: '2',
          title: 'Fix login authentication bug',
          description: 'Users are unable to login with social media accounts',
          priority: 'High',
          assignedTo: 'john',
          created: new Date('2025-01-02'),
          due: new Date('2025-01-10'),
          tags: ['bugs', 'urgent'],
          subtasks: [],
          notes: 'Check OAuth configuration',
          status: 'Todo'
        }
      ];
      setTasks(sampleTasks);
    }

    if (savedGroups) setGroups(JSON.parse(savedGroups));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedTags) setTags(JSON.parse(savedTags));
    if (savedPriorities) setPriorities(JSON.parse(savedPriorities));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kanban-groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('kanban-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('kanban-tags', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem('kanban-priorities', JSON.stringify(priorities));
  }, [priorities]);

  const handleNewTask = (status?: string) => {
    setNewTaskStatus(status || 'Todo');
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData } as Task
          : task
      ));
      toast.success('Task updated successfully');
    } else {
      // Create new task
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: taskData.title || '',
        description: taskData.description || '',
        priority: (taskData.priority as 'Low' | 'Medium' | 'High') || 'Medium',
        assignedTo: taskData.assignedTo || '',
        created: new Date(),
        due: taskData.due,
        tags: taskData.tags || [],
        subtasks: taskData.subtasks || [],
        notes: taskData.notes || '',
        status: taskData.status || newTaskStatus
      };
      setTasks(prev => [...prev, newTask]);
      toast.success('Task created successfully');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully');
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: targetStatus };
        
        // Update timestamps based on status
        if (targetStatus === 'In Progress' && !task.started) {
          updatedTask.started = new Date();
        } else if (targetStatus === 'Done' && !task.completed) {
          updatedTask.completed = new Date();
        }
        
        return updatedTask;
      }
      return task;
    }));
    
    toast.success('Task moved successfully');
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        onNewTask={() => handleNewTask()}
        onSettings={() => setIsSettingsModalOpen(true)}
      />
      
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {groups.map(group => (
            <div key={group} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <KanbanColumn
                title={group}
                tasks={getTasksByStatus(group)}
                onNewTask={() => handleNewTask(group)}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onDrop={(e) => handleDrop(e, group)}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
              />
            </div>
          ))}
        </div>
      </main>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        groups={groups}
        users={users}
        tags={tags}
        priorities={priorities}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        groups={groups}
        users={users}
        tags={tags}
        priorities={priorities}
        onUpdateGroups={setGroups}
        onUpdateUsers={setUsers}
        onUpdateTags={setTags}
        onUpdatePriorities={setPriorities}
      />
    </div>
  );
}