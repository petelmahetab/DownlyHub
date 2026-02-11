
import React from 'react';
import { Platform } from '../types';

interface PlatformIconProps {
  platform: Platform;
  onClick: (id: string) => void;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:scale-105"
      onClick={() => onClick(platform.name)}
    >
      <div className={`w-12 h-12 flex items-center justify-center bg-slate-800/50 rounded-xl group-hover:${platform.color} group-hover:${platform.hoverColor} transition-all`}>
        <span className="material-icons text-2xl">{platform.icon}</span>
      </div>
      <span className="text-[10px] font-bold tracking-widest uppercase opacity-60 group-hover:opacity-100">{platform.name}</span>
    </div>
  );
};

export default PlatformIcon;
