
import React, { useState } from 'react';
import { Heart, Calendar, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const PeriodTracker = () => {
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | null>(null);
  const [cycleLength, setCycleLength] = useState(28);
  const [currentMood, setCurrentMood] = useState<string>('');
  const { toast } = useToast();

  const moods = [
    { emoji: '😊', name: 'Happy', color: 'bg-yellow-200 text-yellow-800' },
    { emoji: '😴', name: 'Tired', color: 'bg-blue-200 text-blue-800' },
    { emoji: '😤', name: 'Irritated', color: 'bg-red-200 text-red-800' },
    { emoji: '🥰', name: 'Energetic', color: 'bg-green-200 text-green-800' },
    { emoji: '😢', name: 'Emotional', color: 'bg-purple-200 text-purple-800' },
    { emoji: '🤗', name: 'Content', color: 'bg-pink-200 text-pink-800' }
  ];

  const getCurrentCycleDay = () => {
    if (!lastPeriodDate) return 0;
    const today = new Date();
    const diffTime = today.getTime() - lastPeriodDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getDaysUntilNext = () => {
    const currentDay = getCurrentCycleDay();
    return Math.max(0, cycleLength - currentDay);
  };

  const getCyclePhase = () => {
    const day = getCurrentCycleDay();
    if (day <= 5) return { phase: 'Menstrual', color: 'text-red-500', icon: '🩸' };
    if (day <= 13) return { phase: 'Follicular', color: 'text-green-500', icon: '🌱' };
    if (day <= 16) return { phase: 'Ovulation', color: 'text-yellow-500', icon: '🌟' };
    return { phase: 'Luteal', color: 'text-purple-500', icon: '🌙' };
  };

  const markPeriodStart = () => {
    setLastPeriodDate(new Date());
    toast({
      title: "Period Logged 🩸",
      description: "Take care of yourself during this time. Rest and hydrate well!",
    });
  };

  const logMood = (mood: { emoji: string; name: string; color: string }) => {
    setCurrentMood(mood.name);
    toast({
      title: `Mood Logged: ${mood.emoji} ${mood.name}`,
      description: "Thanks for tracking your mood. Your feelings are valid!",
    });
  };

  const currentPhase = getCyclePhase();
  const cycleProgress = lastPeriodDate ? (getCurrentCycleDay() / cycleLength) * 100 : 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          Period Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cycle Overview */}
        <div className="text-center space-y-3">
          {lastPeriodDate ? (
            <>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Cycle Day {getCurrentCycleDay()} of {cycleLength}
              </div>
              <div className={`text-lg font-semibold ${currentPhase.color}`}>
                {currentPhase.icon} {currentPhase.phase} Phase
              </div>
              <Progress value={cycleProgress} className="h-2" />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {getDaysUntilNext()} days until next period
              </div>
            </>
          ) : (
            <div className="text-gray-600 dark:text-gray-300">
              Track your first period to get started
            </div>
          )}
        </div>

        {/* Period Logging */}
        <div className="space-y-3">
          <Button 
            onClick={markPeriodStart}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Mark Period Start
          </Button>
          
          {lastPeriodDate && (
            <div className="text-xs text-center text-gray-500 dark:text-gray-400">
              Last period: {lastPeriodDate.toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Mood Tracking */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            How are you feeling today?
          </div>
          <div className="grid grid-cols-3 gap-2">
            {moods.map((mood) => (
              <Button
                key={mood.name}
                variant="outline"
                size="sm"
                onClick={() => logMood(mood)}
                className={`
                  h-auto p-2 flex flex-col items-center gap-1 transition-all duration-200
                  ${currentMood === mood.name ? mood.color : ''}
                  hover:scale-105
                `}
              >
                <span className="text-lg">{mood.emoji}</span>
                <span className="text-xs">{mood.name}</span>
              </Button>
            ))}
          </div>
          
          {currentMood && (
            <div className="text-center">
              <Badge variant="secondary" className="animate-fade-in">
                Today: {moods.find(m => m.name === currentMood)?.emoji} {currentMood}
              </Badge>
            </div>
          )}
        </div>

        {/* Self-Care Reminder */}
        <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="h-4 w-4 text-pink-500" />
            <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
              Self-Care Reminder
            </span>
          </div>
          <p className="text-xs text-pink-600 dark:text-pink-400">
            Remember to be gentle with yourself. Your cycle is a natural part of your body's wisdom.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeriodTracker;
