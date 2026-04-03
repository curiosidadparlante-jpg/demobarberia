import React from 'react';

export function ShopBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none flex flex-col bg-[#F58733]">
      {/* Painted Wall Section */}
      <div className="relative flex-grow w-full overflow-hidden">
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full opacity-90"
        >
          {/* Base abstract shapes matching the mural photo */}
          
          {/* Dark grey / black shapes coming from top */}
          <polygon points="-5,0 30,-5 15,45" fill="#2E2E2E" />
          <polygon points="35,-5 70,0 50,70" fill="#2E2E2E" />
          <polygon points="75,-5 105,-5 105,40 85,60" fill="#2E2E2E" />
          
          {/* Red/Burgundy jagged shapes coming from bottom/side */}
          <polygon points="-5,50 15,35 25,65 -5,95" fill="#CD3745" />
          <polygon points="25,105 45,60 65,105" fill="#CD3745" />
          <polygon points="70,55 90,30 105,50 105,105 85,105" fill="#CD3745" />

          {/* Light greyish-blue accent sweeps */}
          <polygon points="-5,85 15,70 5,105" fill="#A0A5B5" />
          <polygon points="105,20 85,-5 105,-5" fill="#A0A5B5" />
          <polygon points="55,105 65,80 80,105" fill="#A0A5B5" />
          
        </svg>
      </div>
      
      {/* Horizontal Wood Slats Section */}
      <div className="relative h-[25vh] min-h-[150px] w-full bg-[#4A2E1C] flex flex-col border-t-[8px] border-[#2A170A] shadow-[inset_0_20px_20px_rgba(0,0,0,0.5)]">
         {/* Generate lines to mimic wood slats */}
         {Array.from({ length: 12 }).map((_, i) => (
           <div key={i} className="flex-1 w-full border-b-[3px] border-[#2A170A] shadow-[0_1px_0_rgba(255,255,255,0.05)]"></div>
         ))}
      </div>
    </div>
  );
}
