
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full animate-float"></div>
      <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full"></div>
    </div>
  );
};

export default AnimatedBackground;
