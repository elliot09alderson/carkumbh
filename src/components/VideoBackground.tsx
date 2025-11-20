import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

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
        <source src="/horilal-trailer.mp4" type="video/mp4" />
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

      {/* Audio control button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-8 right-8 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default VideoBackground;
