import Link from 'next/link';
import React from 'react';

interface QuickActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  shadowColor: string;
}

export function QuickActionCard({
  href,
  title,
  description,
  icon,
  iconBg,
  iconColor,
  borderColor,
  shadowColor,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-${iconColor}/5 to-transparent p-6 hover:border-${borderColor} hover:shadow-xl hover:shadow-${shadowColor} hover:-translate-y-1 transition-all duration-300`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${iconBg} group-hover:${iconBg.replace('/20', '/30')} group-hover:scale-110 transition-all duration-300`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold text-white mb-1 group-hover:text-${iconColor} transition-colors`}>{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <svg className={`w-5 h-5 text-gray-400 group-hover:text-${iconColor} group-hover:translate-x-1 transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
