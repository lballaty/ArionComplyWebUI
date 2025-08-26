// File path: arioncomply-v1/frontend-web/src/components/dashboard/ComplianceProgress.tsx

import React from 'react';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/utils/cn';

interface FrameworkProgress {
  id: string;
  name: string;
  progress: number;
  totalControls: number;
  implementedControls: number;
  status: 'on-track' | 'at-risk' | 'delayed';
}

interface ComplianceProgressProps {
  frameworks: FrameworkProgress[];
  className?: string;
}

const statusConfig = {
  'on-track': { color: 'text-green-600', bg: 'bg-green-100' },
  'at-risk': { color: 'text-yellow-600', bg: 'bg-yellow-100' },
  'delayed': { color: 'text-red-600', bg: 'bg-red-100' }
};

export const ComplianceProgress: React.FC<ComplianceProgressProps> = ({ 
  frameworks, 
  className 
}) => {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg border p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Compliance Progress
      </h3>
      
      <div className="space-y-6">
        {frameworks.map((framework) => (
          <div key={framework.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {framework.name}
              </h4>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  statusConfig[framework.status].bg,
                  statusConfig[framework.status].color
                )}>
                  {framework.status.replace('-', ' ')}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {framework.progress}%
                </span>
              </div>
            </div>
            
            <Progress value={framework.progress} className="h-2" />
            
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                {framework.implementedControls} of {framework.totalControls} controls
              </span>
              <span>
                {framework.totalControls - framework.implementedControls} remaining
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};