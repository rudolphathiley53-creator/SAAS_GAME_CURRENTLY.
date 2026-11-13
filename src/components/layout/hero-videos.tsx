'use client';

import { useEffect, useRef, useState } from 'react';

const videos = [
  {
    label: 'Vidéo 1',
    src: '/videos/VID-20261104-WA0050.mp4',
  },
  {
    label: 'Vidéo 2',
    src: '/videos/VID-20261104-WA0052.mp4',
  },
  {
    label: 'Vidéo 3',
    src: '/videos/VID-20261104-WA0054%281%29.mp4',
  },
];

export function HeroVideos() {
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = videos[selectedVideo];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReduceMotion(preference.matches);

    updateMotionPreference();
    preference.addEventListener('change', updateMotionPreference);
    return () =>
      preference.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reduceMotion === true) {
      videoRef.current?.pause();
      return;
    }

    if (reduceMotion === false) {
      void videoRef.current?.play().catch(() => {});
    }
  }, [reduceMotion, selectedVideo]);

  return (
    <>
      <video
        ref={videoRef}
        key={video.src}
        aria-hidden="true"
        autoPlay={reduceMotion === false}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        onEnded={() =>
          setSelectedVideo((current) => (current + 1) % videos.length)
        }
        playsInline
        preload="metadata"
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <div className="hero-video-shade absolute inset-0" />
      <div className="hero-video-glow pointer-events-none absolute inset-0" />
    </>
  );
}
