
import React, { useState, useEffect } from 'react';
import { Check, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Task } from './Dashboard';
import { useToast } from '@/hooks/use-toast';
import TaskEditor from './TaskEditor';

interface TaskReminderProps {
  task: Task;
  onToggleCompletion: (taskId: string) => void;
  onUpdateTask: (updatedTask: Task) => void;
  currentTime: string;
  delay?: number;
}

const TaskReminder: React.FC<TaskReminderProps> = ({ 
  task, 
  onToggleCompletion,
  onUpdateTask,
  currentTime,
  delay = 0 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    // Check if current time matches task time (within 5 minutes)
    const [taskHour, taskMinute] = task.time.split(':').map(Number);
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    
    const taskMinutes = taskHour * 60 + taskMinute;
    const currentMinutes = currentHour * 60 + currentMinute;
    
    if (Math.abs(currentMinutes - taskMinutes) <= 5 && !task.completed) {
      setShouldPulse(true);
      if (Math.abs(currentMinutes - taskMinutes) === 0) {
        // Exact time match - show notification
        toast({
          title: `⏰ Time for ${task.name}!`,
          description: task.motivationalMessage,
        });
      }
    } else {
      setShouldPulse(false);
    }
  }, [currentTime, task, toast]);

  const handleToggleCompletion = () => {
    onToggleCompletion(task.id);
    if (!task.completed) {
      toast({
        title: "✨ Task Completed!",
        description: `Great job on completing ${task.name}! Keep up the momentum!`,
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spiritual': return 'border-l-spiritual-500 bg-spiritual-50 dark:bg-spiritual-900/20';
      case 'health': return 'border-l-wellness-500 bg-wellness-50 dark:bg-wellness-900/20';
      case 'nutrition': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'rest': return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTimeStatus = () => {
    const [taskHour, taskMinute] = task.time.split(':').map(Number);
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    
    const taskMinutes = taskHour * 60 + taskMinute;
    const currentMinutes = currentHour * 60 + currentMinute;
    
    if (currentMinutes < taskMinutes) return 'upcoming';
    if (Math.abs(currentMinutes - taskMinutes) <= 5) return 'active';
    return 'past';
  };

  const timeStatus = getTimeStatus();

  return (
    <Card 
      className={`
        transition-all duration-300 border-l-4 p-4
        ${getCategoryColor(task.category)}
        ${task.completed ? 'opacity-75 scale-98' : ''}
        ${shouldPulse ? 'animate-pulse-gentle shadow-lg' : ''}
        ${isActive ? 'animate-slide-up' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Task Icon */}
          <div className="text-2xl">
            {task.icon}
          </div>
          
          {/* Task Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                {task.name}
              </h3>
              {task.streak > 0 && (
                <Badge variant="secondary" className="text-xs">
                  🔥 {task.streak}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {task.timeRange || task.time}
              </span>
              {timeStatus === 'active' && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  <Bell className="h-3 w-3 mr-1" />
                  NOW
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
              {task.motivationalMessage}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <TaskEditor task={task} onSave={onUpdateTask} />
          <Button
            variant={task.completed ? "default" : "outline"}
            size="sm"
            onClick={handleToggleCompletion}
            className={`
              transition-all duration-200
              ${task.completed 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'hover:scale-105'
              }
            `}
          >
            <Check className={`h-4 w-4 ${task.completed ? '' : 'opacity-50'}`} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskReminder;
