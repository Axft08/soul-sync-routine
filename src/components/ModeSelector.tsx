
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserMode } from './Dashboard';

interface ModeSelectorProps {
  userMode: UserMode;
  onModeChange: (mode: UserMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ userMode, onModeChange }) => {
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Choose Your Journey
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Select your personalized wellness mode
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant={userMode === 'boy' ? 'default' : 'outline'}
              onClick={() => onModeChange('boy')}
              className={`
                transition-all duration-200 px-6 py-3
                ${userMode === 'boy' 
                  ? 'bg-spiritual-500 hover:bg-spiritual-600 text-white shadow-lg scale-105' 
                  : 'hover:scale-105'
                }
              `}
            >
              <span className="mr-2">🧔</span>
              Boy Mode
            </Button>
            
            <Button
              variant={userMode === 'girl' ? 'default' : 'outline'}
              onClick={() => onModeChange('girl')}
              className={`
                transition-all duration-200 px-6 py-3
                ${userMode === 'girl' 
                  ? 'bg-feminine-500 hover:bg-feminine-600 text-white shadow-lg scale-105' 
                  : 'hover:scale-105'
                }
              `}
            >
              <span className="mr-2">💁</span>
              Girl Mode
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModeSelector;
