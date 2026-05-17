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
    <div className="w-full bg-background py-4 px-4">
      {/* YouTube-style container - centered with max width */}
      <div className="max-w-4xl mx-auto">
        {/* 16:9 aspect ratio wrapper */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-contain bg-black rounded-lg"
          >
              <source src="/horilal-trailer.mp4" type="video/mp4" />
          </video>

          {/* Audio control button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoBackground;
