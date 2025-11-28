import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientVia: string;
  iconBg: string;
  iconColor: string;
  subtitleColor: string;
  borderColor: string;
  shadowColor: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  gradientFrom,
  gradientVia,
  iconBg,
  iconColor,
  subtitleColor,
  borderColor,
  shadowColor,
}: StatsCardProps) {
  return (
    <div className={`group rounded-2xl border border-white/10 bg-gradient-to-br ${gradientFrom} ${gradientVia} to-transparent p-6 hover:border-${borderColor} hover:shadow-xl hover:shadow-${shadowColor} transition-all duration-300`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl ${iconBg} group-hover:${iconBg.replace('/20', '/30')} transition-colors duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
      <div className="pt-3 border-t border-white/10">
        <span className={`text-sm ${subtitleColor} flex items-center gap-1`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${subtitleColor.replace('text-', 'bg-')}`}></span>
          {subtitle}
        </span>
      </div>
    </div>
  );
}
