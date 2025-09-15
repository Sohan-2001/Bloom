
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000); // 1 second

      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ease-out",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="animate-pulse">
        <Image
          src="https://sxldi6vsg8pc7vjq.public.blob.vercel-storage.com/favicon.ico"
          alt="Bloom Preloader"
          width={128}
          height={128}
          priority
        />
      </div>
    </div>
  );
}
