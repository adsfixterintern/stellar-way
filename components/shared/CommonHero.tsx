"use client";
import React, { useState, useRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import Navbar from "../shared/Navbar";
import { Play, Pause, Volume2, VolumeX, Expand } from "lucide-react";
import CustomBtn from "./CustomBtn";

interface CommonHeroProps {
  title: React.ReactNode;
  description: string;
  mainImage: string | StaticImageData;
  buttonText: string;
  buttonPath: string;
  isAboutPage?: boolean;
  youtubeVideoId?: string; // optional — শুধু দিলেই video feature active হবে
}

const CommonHero = ({
  title,
  description,
  mainImage,
  buttonText,
  buttonPath,
  isAboutPage = false,
  youtubeVideoId,
}: CommonHeroProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);

  const postMessage = (action: object) => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(action), "*");
  };

  // Auto pause when section scrolls out of view
  useEffect(() => {
    if (!isPlaying || !youtubeVideoId) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          postMessage({ event: "command", func: "pauseVideo" });
          setIsPlaying(false);
        }
      },
      { threshold: 0.2 }
    );

    if (videoSectionRef.current) observer.observe(videoSectionRef.current);
    return () => observer.disconnect();
  }, [isPlaying, youtubeVideoId]);

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

  const embedUrl = youtubeVideoId
    ? `https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0`
    : "";

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/dn5t9fhya/image/upload/v1773563794/3afac52152e35e30010981a1553eb6b0add11db0_y6nelx.png"
          alt="Banner Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1A4E11F0]/94 z-10" />
      </div>

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto pt-32 lg:pt-40 pb-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Decorative icons */}
        <div className="absolute top-24 right-180">
          <Image
            width={44}
            height={84}
            alt="pata icon"
            src="https://res.cloudinary.com/dn5t9fhya/image/upload/v1773631792/5ac3ee29ac4640e424f5dc9bacca419667a64f4f_seh1ho.png"
            className="rotate-[65deg]"
          />
        </div>
        <div className="absolute -right-32 top-22">
          <Image
            width={209}
            height={290}
            alt="tomato"
            src="https://res.cloudinary.com/dn5t9fhya/image/upload/v1773566661/9d94ced4fa581ea7095acfbdd8f900c7719fc123_sz9sqr.png"
            className="-rotate-[16deg]"
          />
        </div>

        {/* Left Content */}
        <div className={`w-full ${isAboutPage ? "lg:w-[45%]" : "lg:w-1/2"} space-y-8 text-center lg:text-left`}>
          <div className="space-y-6">
            {isAboutPage && (
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <span className="text-gray-400 uppercase tracking-widest text-sm font-bold">
                  About Us
                </span>
                <div className="w-12 h-[1px] bg-gray-400"></div>
              </div>
            )}
            <h1 className="text-white text-5xl lg:text-7xl font-bold leading-[1.1]">
              {title}
            </h1>
            <p className="text-gray-300 text-lg font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {description}
            </p>
          </div>

          {buttonText && (
            <div className="pt-4">
              <CustomBtn title={buttonText} link={buttonPath} />
            </div>
          )}
        </div>

        {/* Right Content — Image or Video */}
        <div className={`relative w-full ${isAboutPage ? "lg:w-[55%]" : "lg:w-1/2"} flex justify-center lg:justify-end`}>
          <div
            ref={videoSectionRef}
            className={`relative ${isAboutPage ? "w-full aspect-video rounded-3xl overflow-hidden" : "w-[320px] h-[320px] md:w-[500px] md:h-[500px] rounded-3xl overflow-hidden"}`}
          >
            {/* Show iframe when playing, image when not */}
            {isPlaying && youtubeVideoId ? (
              <>
                <iframe
                  ref={iframeRef}
                  src={embedUrl}
                  title="YouTube Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />

                {/* Custom Controls */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-2.5 z-10">
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all flex-shrink-0"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolume}
                    className="flex-1 h-1 accent-white cursor-pointer"
                  />

                  <span className="text-white/50 text-xs w-8 text-right flex-shrink-0">
                    {isMuted ? 0 : volume}%
                  </span>

                  <button
                    onClick={() => iframeRef.current?.requestFullscreen()}
                    className="text-white/50 hover:text-white transition-colors flex-shrink-0"
                  >
                    <Expand size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Image
                  src={mainImage}
                  alt="Hero Visual"
                  fill
                  className={`${isAboutPage ? "object-cover" : "object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"}`}
                  priority
                />

                {/* Play button overlay — শুধু youtubeVideoId দেওয়া থাকলে দেখাবে */}
                {youtubeVideoId && (
                  <div
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <Play size={24} className="text-white fill-white ml-1" />
                    </div>
                  </div>
                )}

                {/* Original play button for isAboutPage without video */}
                {isAboutPage && !youtubeVideoId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <Play size={24} className="text-white fill-white ml-1" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonHero;