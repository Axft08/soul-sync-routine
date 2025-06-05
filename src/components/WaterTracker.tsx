import React, { useState } from 'react';
import { Droplets, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { notificationService } from '../services/notificationService';

interface WaterTrackerProps {
  waterIntake: number;
  onWaterIntakeChange: (intake: number) => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ waterIntake, onWaterIntakeChange }) => {
  const [currentAmount, setCurrentAmount] = useState(0.25);
  const { toast } = useToast();

  const addWater = async () => {
    const newIntake = waterIntake + currentAmount;
    onWaterIntakeChange(Math.min(newIntake, 4));
    
    // Trigger haptic feedback
    await notificationService.triggerHaptic();
    
    if (newIntake >= 4) {
      toast({
        title: "🎉 Daily Goal Achieved!",
        description: "Amazing! You've reached your 4L water goal for today!",
      });
    } else if (newIntake >= 3) {
      toast({
        title: "💧 Almost There!",
        description: "You're so close to your daily goal. Keep it up!",
      });
    } else {
      toast({
        title: "💧 Great Progress!",
        description: `You've added ${currentAmount}L. Keep hydrating!`,
      });
    }
  };

  const removeWater = async () => {
    onWaterIntakeChange(Math.max(waterIntake - currentAmount, 0));
    await notificationService.triggerHaptic();
  };

  const progressPercentage = (waterIntake / 4) * 100;

  const getWaterLevel = () => {
    return Math.min((waterIntake / 4) * 100, 100);
  };

  const getMotivationalMessage = () => {
    if (progressPercentage === 0) return "Let's start hydrating! 💪";
    if (progressPercentage < 25) return "Great start! Keep going! 🌟";
    if (progressPercentage < 50) return "You're doing amazing! 💙";
    if (progressPercentage < 75) return "More than halfway there! 🚀";
    if (progressPercentage < 100) return "So close to your goal! 🎯";
    return "Goal achieved! You're a hydration hero! 🏆";
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          Water Intake Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Water Container */}
        <div className="flex justify-center">
          <div className="relative w-24 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-700 ease-out animate-water-fill"
              style={{ height: `${getWaterLevel()}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 z-10">
                {waterIntake.toFixed(1)}L
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Motivational Message */}
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 animate-pulse-gentle">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Amount Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentAmount(Math.max(0.1, currentAmount - 0.25))}
              disabled={currentAmount <= 0.1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {currentAmount}L
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Amount to add
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentAmount(Math.min(1, currentAmount + 0.25))}
              disabled={currentAmount >= 1}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2 justify-center">
            {[0.25, 0.5, 1].map((amount) => (
              <Button
                key={amount}
                variant={currentAmount === amount ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentAmount(amount)}
                className="text-xs"
              >
                {amount}L
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={addWater} 
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            disabled={waterIntake >= 4}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Water
          </Button>
          <Button 
            variant="outline" 
            onClick={removeWater}
            disabled={waterIntake <= 0}
          >
            <Minus className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>

        {/* Daily Goal Info */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Daily Goal: 4 Liters • Remaining: {Math.max(0, 4 - waterIntake).toFixed(1)}L
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterTracker;
