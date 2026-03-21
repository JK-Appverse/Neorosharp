
"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function AdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && bannerRef.current && !bannerRef.current.hasAttribute('data-ad-loaded')) {
      const conf = document.createElement('script');
      conf.type = 'text/javascript';
      conf.innerHTML = `
        atOptions = {
          'key' : '8563c940cab9f6974b624e40d625f398',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//www.highperformanceformat.com/8563c940cab9f6974b624e40d625f398/invoke.js';
      
      bannerRef.current.appendChild(conf);
      bannerRef.current.appendChild(script);
      bannerRef.current.setAttribute('data-ad-loaded', 'true');
    }
  }, [mounted]);

  if (!mounted) return <div className="h-[50px] w-full" />;

  return (
    <div className="flex justify-center my-2 overflow-hidden min-h-[50px] w-full" ref={bannerRef} />
  );
}
