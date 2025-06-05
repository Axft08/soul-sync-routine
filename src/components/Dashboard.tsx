
import React, { useState, useEffect } from 'react';
import { Clock, Heart, Water, Bell, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import WaterTracker from './WaterTracker';
import TaskReminder from './TaskReminder';
import ModeSelector from './ModeSelector';
import PeriodTracker from './PeriodTracker';

export type UserMode = 'boy' | 'girl';

export interface Task {
  id: string;
  name: string;
  time: string;
  timeRange?: string;
  icon: string;
  category: 'spiritual' | 'health' | 'nutrition' | 'rest';
  completed: boolean;
  streak: number;
  motivationalMessage: string;
}

const Dashboard = () => {
  const [userMode, setUserMode] = useState<UserMode>('boy');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [waterIntake, setWaterIntake] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const defaultTasks: Task[] = [
    {
      id: '1',
      name: 'Fajr Namaz & Quran',
      time: '05:00',
      icon: '🕌',
      category: 'spiritual',
      completed: false,
      streak: 0,
      motivationalMessage: 'Start your day with divine connection'
    },
    {
      id: '2',
      name: 'Gym/Workout',
      time: '06:00',
      timeRange: '06:00 - 08:00',
      icon: '💪',
      category: 'health',
      completed: false,
      streak: 0,
      motivationalMessage: 'Your body is your temple - honor it'
    },
    {
      id: '3',
      name: 'Breakfast',
      time: '08:30',
      timeRange: '08:30 - 09:00',
      icon: '🍳',
      category: 'nutrition',
      completed: false,
      streak: 0,
      motivationalMessage: 'Fuel your body for the day ahead'
    },
    {
      id: '4',
      name: 'Zuhar Namaz & Lunch',
      time: '13:00',
      timeRange: '13:00 - 14:00',
      icon: '🕌',
      category: 'spiritual',
      completed: false,
      streak: 0,
      motivationalMessage: 'Pause, pray, and nourish yourself'
    },
    {
      id: '5',
      name: 'Asr Namaz & Protein Snack',
      time: '17:00',
      timeRange: '17:00 - 18:00',
      icon: '🕌',
      category: 'spiritual',
      completed: false,
      streak: 0,
      motivationalMessage: 'Afternoon renewal for body and soul'
    },
    {
      id: '6',
      name: 'Isha Namaz & Dinner',
      time: '21:00',
      icon: '🕌',
      category: 'spiritual',
      completed: false,
      streak: 0,
      motivationalMessage: 'End your day with gratitude and nourishment'
    },
    {
      id: '7',
      name: 'Sleep',
      time: '23:00',
      timeRange: '23:00 - 00:00',
      icon: '😴',
      category: 'rest',
      completed: false,
      streak: 0,
      motivationalMessage: 'Rest well - tomorrow is a new blessing'
    }
  ];

  useEffect(() => {
    setTasks(defaultTasks);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTimeString = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompletedTasks = () => tasks.filter(task => task.completed).length;
  const getTotalTasks = () => tasks.length;
  const getCompletionPercentage = () => (getCompletedTasks() / getTotalTasks()) * 100;

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, streak: task.completed ? task.streak : task.streak + 1 }
        : task
    ));
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spiritual': return 'bg-spiritual-500';
      case 'health': return 'bg-wellness-500';
      case 'nutrition': return 'bg-yellow-500';
      case 'rest': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-spiritual-50 to-wellness-50'}`}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {getGreeting()}! 🌟
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-mono bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
              {getCurrentTimeString()}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="animate-pulse-gentle"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mode Selector */}
        <ModeSelector userMode={userMode} onModeChange={setUserMode} />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Daily Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {getCompletedTasks()}/{getTotalTasks()}
              </div>
              <Progress value={getCompletionPercentage()} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Water Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {waterIntake}L / 4L
              </div>
              <Progress value={(waterIntake / 4) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                🔥 {Math.max(...tasks.map(t => t.streak), 0)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Days consistent
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks List */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map((task, index) => (
                <TaskReminder
                  key={task.id}
                  task={task}
                  onToggleCompletion={toggleTaskCompletion}
                  currentTime={getCurrentTimeString()}
                  delay={index * 100}
                />
              ))}
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Water Tracker */}
            <WaterTracker 
              waterIntake={waterIntake} 
              onWaterIntakeChange={setWaterIntake}
            />

            {/* Period Tracker for Girl Mode */}
            {userMode === 'girl' && <PeriodTracker />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
