import React from "react";
import GeneratedMusicBox from "@/components/generated-music-box";
import ChordBox from "@/components/chord-box";
const OutputBox = ({ isGenerated }) => {
  return (
    <div
      className={`flex flex-col gap-5 min-h-full min-w-full ${
        !isGenerated ? "opacity-50" : ""
      }`}
    >
      <GeneratedMusicBox isInteractive={isGenerated} />
      <ChordBox isInteractive={isGenerated} />
    </div>
  );
};
export default OutputBox;
