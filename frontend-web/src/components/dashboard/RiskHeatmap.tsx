// File path: arioncomply-v1/frontend-web/src/components/dashboard/RiskHeatmap.tsx

import React from 'react';
import { cn } from '@/utils/cn';

interface RiskData {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'very_high' | 'critical';
  count: number;
}

interface RiskHeatmapProps {
  data: RiskData[];
  className?: string;
}

const severityConfig = {
  low: { color: 'bg-green-500', label: 'Low' },
  medium: { color: 'bg-yellow-500', label: 'Medium' },
  high: { color: 'bg-orange-500', label: 'High' },
  very_high: { color: 'bg-red-500', label: 'Very High' },
  critical: { color: 'bg-red-800', label: 'Critical' }
};

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ data, className }) => {
  const maxCount = Math.max(...data.map(item => item.count));
  
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg border p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Risk Heat Map
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(severityConfig).map(([severity, config]) => {
          const riskItem = data.find(item => item.severity === severity);
          const count = riskItem?.count || 0;
          const opacity = maxCount > 0 ? Math.max(0.3, count / maxCount) : 0.3;
          
          return (
            <div
              key={severity}
              className="relative p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-center cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              title={`${config.label}: ${count} risks`}
            >
              <div
                className={cn(config.color, 'w-full h-8 rounded mb-2')}
                style={{ opacity }}
              />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {config.label}
              </p>
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                {count}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};