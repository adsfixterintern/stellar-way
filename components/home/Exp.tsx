"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand } from "react-icons/fa";
import bg from "@/assets/img/expbg.png";

const YOUTUBE_VIDEO_ID = "Ujb09AVZeBk";

const Exp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const postMessage = (action: object) => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(action), "*");
  };

  // Auto pause when section goes out of view
  useEffect(() => {
    if (!isPlaying) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          postMessage({ event: "command", func: "pauseVideo" });
          setIsPlaying(false);
        }
      },
      { threshold: 0.2 } // 20% visible থাকলেই চলবে, বের হলে pause
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [isPlaying]);

  const handlePlay = () => setIsPlaying(true);

  const togglePlay = () => {
    if (isPlaying) {
      postMessage({ event: "command", func: "pauseVideo" });
    } else {
      postMessage({ event: "command", func: "playVideo" });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (isMuted) {
      postMessage({ event: "command", func: "unMute" });
      postMessage({ event: "command", func: "setVolume", args: [volume] });
    } else {
      postMessage({ event: "command", func: "mute" });
    }
    setIsMuted(!isMuted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    postMessage({ event: "command", func: "setVolume", args: [val] });
    setIsMuted(val === 0);
  };

  const embedUrl = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0`;

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-white">
      <div className="w-full relative group z-10">
        <div className="relative w-full h-[350px] md:h-[550px] lg:h-[650px] overflow-hidden bg-black">

          {!isPlaying && (
            <>
              <Image
                src={bg}
                alt="Experience Savory Nest"
                fill
                className="object-cover brightness-[0.5] group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                priority
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-3xl md:text-[50px] lg:text-[72px] font-bold text-white mb-4 tracking-tight leading-tight">
                  Experience Savory Nest
                </h2>
                <p className="text-white/80 text-[14px] md:text-[18px] font-normal tracking-[0.2em] mb-12 uppercase">
                  Take a Virtual Tour of Our Restaurant
                </p>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full animate-pulse"></div>
                  <button
                    onClick={handlePlay}
                    className="relative w-16 h-16 md:w-20 md:h-20 bg-[#2d402d] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#3d5a3d] cursor-pointer"
                  >
                    <FaPlay className="ml-1 text-xl md:text-2xl" />
                  </button>
                </div>
              </div>
            </>
          )}

          {isPlaying && (
            <>
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title="Savory Nest Virtual Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />

              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-4 bg-black/50 backdrop-blur-sm px-5 py-3">
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 bg-[#2d402d] hover:bg-[#3d5a3d] rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-105 flex-shrink-0"
                >
                  {isPlaying ? <FaPause className="text-sm" /> : <FaPlay className="ml-0.5 text-sm" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                >
                  {isMuted || volume === 0 ? <FaVolumeMute className="text-lg" /> : <FaVolumeUp className="text-lg" />}
                </button>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolume}
                  className="flex-1 h-1.5 accent-[#2d402d] cursor-pointer"
                />

                <span className="text-white/50 text-xs w-8 text-right flex-shrink-0">
                  {isMuted ? 0 : volume}%
                </span>

                <button
                  onClick={() => iframeRef.current?.requestFullscreen()}
                  className="text-white/50 hover:text-white transition-colors flex-shrink-0"
                  title="Fullscreen"
                >
                  <FaExpand className="text-sm" />
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
};

export default Exp;