'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export default function AdSlot({ 
  position = 'banner', 
  gameId = null,
  className = '' 
}) {
  const [adContent, setAdContent] = useState(null);

  useEffect(() => {
    // Load house ads by default - easily replaceable with network tags
    loadHouseAd();
  }, [position, gameId]);

  const loadHouseAd = () => {
    const houseAds = {
      banner: {
        title: "Upgrade to Pro",
        description: "Unlock premium game modes and global leaderboards!",
        cta: "Upgrade Now",
        link: "/pricing"
      },
      sidebar: {
        title: "Try Elite",
        description: "Get access to Extreme games and Season Pass",
        cta: "Go Elite",
        link: "/pricing"
      },
      footer: {
        title: "More Games",
        description: "Discover all 25+ games in our collection",
        cta: "Browse Games",
        link: "/games"
      }
    };

    setAdContent(houseAds[position] || houseAds.banner);
  };

  if (!adContent) return null;

  const sizeClasses = {
    banner: 'h-24 w-full',
    sidebar: 'h-32 w-full',
    footer: 'h-20 w-full'
  };

  return (
    <Card className={`${sizeClasses[position]} ${className} p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-dashed border-2 border-blue-200`}>
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-gray-800">{adContent.title}</h4>
          <p className="text-xs text-gray-600 mt-1">{adContent.description}</p>
        </div>
        <a 
          href={adContent.link}
          className="ml-4 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
        >
          {adContent.cta}
        </a>
      </div>
      
      {/* Network ad tag placeholder - replace this div with actual ad network code */}
      <div className="hidden" data-ad-slot={`${position}-${gameId || 'general'}`}>
        {/* Ad network tags go here */}
      </div>
    </Card>
  );
}