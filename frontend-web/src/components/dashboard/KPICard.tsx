// File path: arioncomply-v1/frontend-web/src/components/dashboard/KPICard.tsx

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  variant?: 'success' | 'warning' | 'danger' | 'primary';
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  variant = 'primary',
  className
}) => {
  const variantStyles = {
    success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    danger: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    primary: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
  };

  const iconStyles = {
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    primary: 'text-blue-600 dark:text-blue-400'
  };

  return (
    <div className={cn(
      'p-6 rounded-lg border',
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {change !== undefined && (
            <p className={cn(
              'text-xs mt-1',
              change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}>
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <Icon size={24} className={iconStyles[variant]} />
      </div>
    </div>
  );
};