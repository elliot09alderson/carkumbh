import { useEffect, useRef } from "react";

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        // muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/HORILAL TRAILER.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Vignette effect - radial gradient from center to edges */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Gradient overlay for content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-30" />
    </div>
  );
};

export default VideoBackground;
