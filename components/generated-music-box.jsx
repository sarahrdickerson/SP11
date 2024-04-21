"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileIdContext } from "@/context/fileIdContext";
import AudioWave from "./playback/audio-wave";

const GeneratedMusicBox = ({ isInteractive }) => {
  const { currentFileId } = React.useContext(FileIdContext);
  const dynamicUrl = isInteractive
    ? `/api/download/wav/${currentFileId}`
    : "/audio.wav";

  React.useEffect(() => {
    console.log("Current File ID updated:", currentFileId);
  }, [currentFileId]);

  const handleWavDownload = async () => {
    console.log("Download Wav");
    console.log(currentFileId);

    // if (!currentFileId) {
    //   console.log("No file ID");
    //   return;
    // }

    try {
      const res = await fetch(`/api/download/wav/${currentFileId}`);
      console.log(currentFileId);
      // const res = await fetch(`/api/download/${"65e55397c66cc84d45576e6c"}`);
      // const res = await fetch(`/api/download/${"65e5fd8d478be54296f5a478"}`);
      if (res.status === 200) {
        console.log("Content-Type:", res.headers.get("Content-Type")); // Log the response content type

        const blob = await res.blob(); // Read the stream here
        console.log(blob); // Log the blob object, not res.blob()

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "generated_music.wav";
        document.body.appendChild(a); // Append the anchor to the body
        a.click();
        document.body.removeChild(a); // Clean up by removing the anchor
        URL.revokeObjectURL(url); // Release the object URL
      } else {
        console.log("Download failed");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const overlayStyle = isInteractive
    ? {}
    : {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.5)", // or any other color for the overlay
        zIndex: 2, // ensure it's above the content but below the modal/dialog if any
      };

  return (
    <div
      className={`relative flex flex-col gap-5 rounded-lg p-10 min-h-full min-w-full bg-white ${
        isInteractive ? "" : "cursor-not-allowed"
      }`}
      style={{ position: "relative" }} // make this element positioned relatively
    >
      {!isInteractive && <div style={overlayStyle} />}
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-semibold">Generated Music</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={!isInteractive}>
            <div>
              <DownloadIcon className="h-5 w-5 text-gray-800/25 cursor-pointer " />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={5} align="end">
            {/* <DropdownMenuItem>Download MIDI</DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleWavDownload}>
              Download wav
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col items-center">
        <AudioWave isInteractive={isInteractive} url={dynamicUrl} />
        {/* <Image src="/soundwave.png" width={600} height={500} /> */}
        <div className="flex flex-row gap-5 items-center">
          {/* <Button>Play</Button>  */}
        </div>
      </div>
    </div>
  );
};

export default GeneratedMusicBox;
