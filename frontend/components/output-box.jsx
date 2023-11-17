import React from "react";
import GeneratedMusicBox from "@/components/generated-music-box";
import ChordBox from "@/components/chord-box";
const OutputBox = () => {
  return (
    <div className="flex flex-col gap-5 min-h-full min-w-full">
      <GeneratedMusicBox />
      <ChordBox />
    </div>
  );
};

export default OutputBox;
