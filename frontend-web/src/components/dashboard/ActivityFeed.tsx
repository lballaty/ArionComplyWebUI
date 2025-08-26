// File path: arioncomply-v1/frontend-web/src/components/dashboard/ActivityFeed.tsx

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock, User, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ActivityItem {
  id: string;
  type: 'audit' | 'risk' | 'policy' | 'training' | 'incident';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  status?: 'pending' | 'completed' | 'overdue';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
}

const activityConfig = {
  audit: { icon: CheckCircle, color: 'text-blue-600' },
  risk: { icon: AlertTriangle, color: 'text-red-600' },
  policy: { icon: FileText, color: 'text-green-600' },
  training: { icon: User, color: 'text-purple-600' },
  incident: { icon: AlertTriangle, color: 'text-orange-600' }
};

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
  overdue: { color: 'bg-red-100 text-red-800', label: 'Overdue' }
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, className }) => {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg border p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;
          
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className={cn('mt-1', config.color)}>
                <Icon size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </h4>
                  {activity.status && (
                    <span className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      statusConfig[activity.status].color
                    )}>
                      {statusConfig[activity.status].label}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                  </div>
                  {activity.user && (
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{activity.user}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};