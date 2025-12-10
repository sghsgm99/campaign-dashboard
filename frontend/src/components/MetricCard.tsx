import React from 'react';

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: number;
  color: string;
}

const MetricCard = ({ icon: Icon, label, value, change, color }: MetricCardProps) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      {change && (
        <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default MetricCard;
