import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save, X, Trash2 } from 'lucide-react';
import { Task } from './Dashboard';

interface TaskManagerProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onTasksChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: '',
    time: '12:00',
    icon: '📝',
    category: 'health',
    motivationalMessage: '',
    timeRange: ''
  });

  const handleAddTask = () => {
    if (!newTask.name || !newTask.time) return;
    
    const task: Task = {
      id: Date.now().toString(),
      name: newTask.name,
      time: newTask.time,
      timeRange: newTask.timeRange,
      icon: newTask.icon || '📝',
      category: newTask.category as Task['category'],
      completed: false,
      streak: 0,
      motivationalMessage: newTask.motivationalMessage || 'Stay motivated!'
    };
    
    const updatedTasks = [...tasks, task].sort((a, b) => a.time.localeCompare(b.time));
    onTasksChange(updatedTasks);
    
    setNewTask({
      name: '',
      time: '12:00',
      icon: '📝',
      category: 'health',
      motivationalMessage: '',
      timeRange: ''
    });
    setIsOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    onTasksChange(updatedTasks);
  };

  const categories = [
    { value: 'spiritual', label: 'Spiritual' },
    { value: 'health', label: 'Health' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'rest', label: 'Rest' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Tasks</DialogTitle>
        </DialogHeader>
        
        {/* Existing Tasks */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Current Tasks</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <span>{task.icon}</span>
                  <span className="font-medium">{task.name}</span>
                  <span className="text-sm text-gray-500">{task.time}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Add New Task */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3">Add New Task</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-name">Task Name</Label>
              <Input
                id="new-name"
                value={newTask.name || ''}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                placeholder="Enter task name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="new-icon">Icon (Emoji)</Label>
              <Input
                id="new-icon"
                value={newTask.icon || ''}
                onChange={(e) => setNewTask({ ...newTask, icon: e.target.value })}
                placeholder="📝"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="new-time">Time</Label>
              <Input
                id="new-time"
                type="time"
                value={newTask.time || ''}
                onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="new-timeRange">Time Range (Optional)</Label>
              <Input
                id="new-timeRange"
                value={newTask.timeRange || ''}
                onChange={(e) => setNewTask({ ...newTask, timeRange: e.target.value })}
                placeholder="e.g., 06:00 - 08:00"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="new-category">Category</Label>
              <Select
                value={newTask.category}
                onValueChange={(value) => setNewTask({ ...newTask, category: value as Task['category'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="new-motivationalMessage">Motivational Message</Label>
              <Textarea
                id="new-motivationalMessage"
                value={newTask.motivationalMessage || ''}
                onChange={(e) => setNewTask({ ...newTask, motivationalMessage: e.target.value })}
                placeholder="Enter a motivational message"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleAddTask} disabled={!newTask.name || !newTask.time}>
            <Save className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskManager;
