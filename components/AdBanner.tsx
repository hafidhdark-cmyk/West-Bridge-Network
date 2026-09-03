'use client';

import React, { useEffect } from 'react';

const ADSENSE_CLIENT_ID = 'ca-pub-2586916860240984';

interface AdBannerProps {
  slotType?: 'inline' | 'sidebar' | 'header' | 'article-inline';
  adSlotId?: string;
}

export default function AdBanner({ slotType = 'inline', adSlotId }: AdBannerProps) {
  useEffect(() => {
    // Only attempt ad push if a valid adSlotId is provided
    if (adSlotId && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense push exception:', e);
      }
    }
  }, [adSlotId]);

  // Clean layout during AdSense review: Mute empty placeholders
  // Google AdSense Auto Ads handles the site review via the verification code in <head>
  if (!adSlotId) {
    return null;
  }

  return (
    <div className="w-full my-4 flex justify-center items-center overflow-hidden">
      {/* Active Google AdSense Ad Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
