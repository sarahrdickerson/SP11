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

const GeneratedMusicBox = () => {
  const { currentFileId } = React.useContext(FileIdContext);

  const handleWavDownload = async () => {
    console.log("Download Wav");
    console.log(currentFileId);

    // if (!currentFileId) {
    //   console.log("No file ID");
    //   return;
    // }

    try {
      // const res = await fetch("/api/download/${currentFileId}");
      const res = await fetch(`/api/download/${"65e55397c66cc84d45576e6c"}`);
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

  return (
    <div className="flex flex-col gap-5 rounded-lg border-slate-400/25 p-10 border min-h-full min-w-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-semibold">Generated Music</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <DownloadIcon className="h-5 w-5 text-gray-800/25" />
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
        <Image src="/soundwave.png" width={600} height={500} />
        <div className="flex flex-row gap-5 items-center">
          <Button>Play</Button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedMusicBox;
