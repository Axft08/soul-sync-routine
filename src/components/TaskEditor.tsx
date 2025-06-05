
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, X } from 'lucide-react';
import { Task } from './Dashboard';

interface TaskEditorProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ task, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleSave = () => {
    onSave(editedTask);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsOpen(false);
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
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              value={editedTask.name}
              onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="icon">Icon (Emoji)</Label>
            <Input
              id="icon"
              value={editedTask.icon}
              onChange={(e) => setEditedTask({ ...editedTask, icon: e.target.value })}
              placeholder="🕌"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={editedTask.time}
              onChange={(e) => setEditedTask({ ...editedTask, time: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="timeRange">Time Range (Optional)</Label>
            <Input
              id="timeRange"
              value={editedTask.timeRange || ''}
              onChange={(e) => setEditedTask({ ...editedTask, timeRange: e.target.value })}
              placeholder="e.g., 06:00 - 08:00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={editedTask.category}
              onValueChange={(value) => setEditedTask({ ...editedTask, category: value as Task['category'] })}
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
            <Label htmlFor="motivationalMessage">Motivational Message</Label>
            <Textarea
              id="motivationalMessage"
              value={editedTask.motivationalMessage}
              onChange={(e) => setEditedTask({ ...editedTask, motivationalMessage: e.target.value })}
              placeholder="Enter a motivational message for this task"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditor;
