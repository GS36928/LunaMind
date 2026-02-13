"use client";

import "@mux/mux-player";
import React, { useRef, useState, useEffect } from "react";
import { NoteBook, Star, VolumeOff, VolumeOn } from "./Icons";

interface MuxPlayerElement extends HTMLElement {
  muted: boolean;
  play: () => Promise<void>;
  pause: () => void;
}

const VideoLesson = () => {
  const playbackId = "RMmbqoOzUxXe57UcSdokiP6JX01U9VV7I9g202k7kqab8";
  const playerRef = useRef<MuxPlayerElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.muted = muted;
      playerRef.current.play();
    }
  }, [muted]);

  const toggleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted = !muted;
    }
    setMuted((prev) => !prev);
  };

  return (
    <div className="w-full md:flex md:mx-auto md:justify-center overflow-hidden rounded-2xl sm:rounded-3xl relative md:w-[720px] lg:order-2 lg:w-[60%]">
      {React.createElement("mux-player", {
        ref: playerRef,
        "playback-id": playbackId,
        "stream-type": "on-demand",
        autoplay: true,
        muted: muted,
        loop: true,
        controls: false,
        width: "100%",
        height: "auto",
        style: { display: "block" },
      })}

      <div className="absolute inset-0 z-20 pointer-events-auto"></div>

      <div className="flex items-center gap-2 absolute z-30 bg-[#000000]/20 top-4 left-4 sm:top-6 sm:left-6 backdrop-blur-[24px] py-[10px] rounded-[40px] px-[12px]">
        <div className="w-3 h-3 rounded-full bg-[#52CE91]"></div>
        <span className="text-xs leading-4 font-helveticaneue-regular text-white">
          კარგი კავშირი
        </span>
      </div>

      <button
        onClick={toggleMute}
        className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 bg-[#000000]/20 backdrop-blur-[24px] px-3 py-2 rounded-[40px]"
      >
        {muted ? <VolumeOff /> : <VolumeOn />}
      </button>

      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 bg-[#000000]/20 backdrop-blur-[24px] flex items-center gap-2 px-3 py-2 rounded-[40px]">
        <NoteBook />
        <span className="text-xs leading-4 text-white font-helveticaneue-regular">
          ჩვენი რეპეტიტორი
        </span>
      </div>

      <div className="hidden sm:flex absolute top-6 right-6 items-center bg-[#FFFFFF] backdrop-blur-[24px] gap-2 px-3 py-2 rounded-[40px]">
        <Star />
        <span className="text-[#0C0F21] text-xs leading-4">
          მაღალი შეფასება
        </span>
      </div>
    </div>
  );
};

export default VideoLesson;
