import React from 'react';

interface UserAvatarProps {
  name: string;
  className?: string;
}

export default function UserAvatar({ name, className = 'w-10 h-10 text-sm' }: UserAvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  // Palette of beautiful, modern solid background colors
  const colors = [
    'bg-primary',
    'bg-secondary',
    'bg-tertiary',
    'bg-purple-700',
    'bg-indigo-600',
    'bg-teal-700',
    'bg-rose-600',
    'bg-amber-600'
  ];

  // Simple string hashing function to choose a consistent color per user name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorClass = colors[Math.abs(hash) % colors.length];

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white select-none ${colorClass} ${className}`}
    >
      {initial}
    </div>
  );
}
